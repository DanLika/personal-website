import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT } from "../config/aiSystemPrompt";

// Initialize Gemini with API key from environment
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }

  return new GoogleGenerativeAI(apiKey);
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send a message to Gemini and get a response
 * @param messages - Array of previous messages for context
 * @param userMessage - The new message from the user
 * @param language - Current language ('en' or 'bs')
 * @returns The AI response
 */
export const sendMessageToGemini = async (
  messages: ChatMessage[],
  userMessage: string,
  language: string = "en"
): Promise<string> => {
  try {
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    // Build conversation history for context
    const history = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({
      history: history as Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Build the full message with system context for first message
    const languageInstruction = language === 'bs'
      ? '\n\nOdgovori na bosanskom jeziku.'
      : '\n\nRespond in English.';

    const fullMessage = messages.length === 0
      ? `${AI_SYSTEM_PROMPT}${languageInstruction}\n\nUser question: ${userMessage}`
      : userMessage;

    // Send the new message
    const result = await chat.sendMessage(fullMessage);
    const response = result.response;

    return response.text();
  } catch (error) {
    // Return a friendly error message based on language
    if (language === "bs") {
      return "Izvinite, došlo je do greške. Molimo pokušajte ponovo ili me kontaktirajte direktno putem email-a.";
    }
    return "Sorry, something went wrong. Please try again or contact me directly via email.";
  }
};

/**
 * Check if the Gemini API key is configured
 */
export const isGeminiConfigured = (): boolean => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};
