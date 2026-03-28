/**
 * Client-side chat configuration.
 * The system prompt has been moved to the server (netlify/functions/lib/aiSystemPrompt.ts)
 * to prevent exposing business strategy and pricing details in the browser bundle.
 */

export const INITIAL_SUGGESTIONS = {
  en: [
    "What kind of apps can you build?",
    "Tell me about the BookBed project",
    "How long would a booking app take?",
    "What's your tech stack?"
  ],
  bs: [
    "Kakve aplikacije možeš napraviti?",
    "Reci mi više o BookBed projektu",
    "Koliko bi trajala izrada booking aplikacije?",
    "Koje tehnologije koristiš?"
  ]
};

export const CHAT_INITIAL_MESSAGE = {
  en: "Hi! I'm an AI assistant that knows about Dusko's work and experience. What would you like to know? Ask about his projects, skills, or how he could help with your project.",
  bs: "Zdravo! Ja sam AI asistent koji zna sve o Duškovom radu i iskustvu. Šta biste željeli znati? Pitajte o njegovim projektima, vještinama, ili kako vam može pomoći sa vašim projektom."
};
