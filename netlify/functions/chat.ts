import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT } from "./lib/aiSystemPrompt";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  userMessage: string;
  language: string;
}

// Simple in-memory rate limiter (resets on cold start, good enough for portfolio)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) {
    return true;
  }

  return false;
}

export default async (req: Request): Promise<Response> => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Rate limiting
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Validate API key is configured server-side
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI chat is not configured." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body: RequestBody = await req.json();
    const { messages, userMessage, language = "en" } = body;

    // Basic input validation
    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      userMessage.length > 2000
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!Array.isArray(messages) || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid conversation history." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const languageInstruction =
      language === "bs"
        ? "\n\nOdgovori na bosanskom jeziku."
        : "\n\nRespond in English.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: `${AI_SYSTEM_PROMPT}${languageInstruction}`,
    });

    // Build conversation history — sanitize client-provided roles and content
    const sanitized = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: (msg.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: String(msg.content).slice(0, 2000) }],
      }));

    const chat = model.startChat({
      history: sanitized,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    return new Response(
      JSON.stringify({ response: responseText }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to generate response." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
