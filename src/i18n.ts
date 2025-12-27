import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Get saved language or default to Bosnian (primary SEO language)
const getSavedLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("i18nextLng") || "bs";
  }
  return "bs";
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getSavedLanguage(),
    fallbackLng: "bs",
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
