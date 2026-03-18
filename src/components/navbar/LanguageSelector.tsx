import React from "react";
import { motion } from "framer-motion";
import type { i18n } from "i18next";

interface LanguageSelectorProps {
  i18n: i18n;
  toggleLang: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  i18n,
  toggleLang,
}) => {
  return (
    <motion.button
      onClick={toggleLang}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 text-2xl"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-label={
        i18n.language === "en"
          ? "Switch to Bosnian language"
          : "Switch to English language"
      }
      title={
        i18n.language === "en" ? "Switch to Bosnian" : "Switch to English"
      }
    >
      <span role="img" aria-hidden="true">
        {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
      </span>
    </motion.button>
  );
};
