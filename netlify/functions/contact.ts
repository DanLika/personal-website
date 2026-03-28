interface ContactBody {
  name: string;
  email: string;
  message: string;
}

// Simple rate limiter for contact form
const contactRateMap = new Map<string, { count: number; resetAt: number }>();
const CONTACT_LIMIT = 5; // max submissions per window
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    contactRateMap.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > CONTACT_LIMIT;
}

// Basic email format check
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many submissions. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "duskolicanin1234@gmail.com";

  if (!resendApiKey) {
    return new Response(
      JSON.stringify({ error: "Contact form is not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body: ContactBody = await req.json();
    const { name, email, message } = body;

    // Validate inputs
    if (!name || typeof name !== "string" || name.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid name." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !isValidEmail(email) || email.length > 320) {
      return new Response(
        JSON.stringify({ error: "Invalid email." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Invalid message." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [contactEmail],
        subject: `Portfolio Contact: ${name}`,
        reply_to: email,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send message." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
