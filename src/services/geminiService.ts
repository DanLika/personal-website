export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send a message via the server-side chat function (API key stays on server)
 */
export const sendMessageToGemini = async (
  messages: ChatMessage[],
  userMessage: string,
  language: string = "en"
): Promise<string> => {
  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, userMessage, language }),
    });

    if (response.status === 429) {
      if (language === "bs") {
        return "Previše zahtjeva. Molimo pokušajte ponovo za nekoliko minuta.";
      }
      return "Too many requests. Please try again in a few minutes.";
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch {
    if (language === "bs") {
      return "Izvinite, došlo je do greške. Molimo pokušajte ponovo ili me kontaktirajte direktno putem email-a.";
    }
    return "Sorry, something went wrong. Please try again or contact me directly via email.";
  }
};

/**
 * Check if the chat function is available
 */
export const isGeminiConfigured = (): boolean => {
  // Always return true — the server function handles the API key check
  return true;
};
