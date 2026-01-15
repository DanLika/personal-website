import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Get initial language: saved preference > geo-detection (BiH = bs) > default to English
const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    // Check for saved preference first
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang) {
      return savedLang;
    }
    
    // Geo-detection: only use Bosnian if user is from Bosnia and Herzegovina
    // Check timezone as a reliable indicator (Europe/Sarajevo)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === "Europe/Sarajevo") {
      return "bs";
    }
    
    // Default to English for all other cases
    return "en";
  }
  return "en";
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: ["bs", "en"],
    debug: false,
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });

export default i18n;
