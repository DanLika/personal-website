import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MagnetButton } from "../ui/MagnetButton";

interface LanguageToggleProps {
  toggleLang: () => void;
}

export const LanguageToggle = ({ toggleLang }: LanguageToggleProps) => {
  const { i18n } = useTranslation();

  return (
    <MagnetButton
      magnetStrength={4}
      padding={50}
      activeTransition="transform 0.2s ease-out"
      inactiveTransition="transform 0.4s ease-in-out"
    >
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
        title={i18n.language === "en" ? "Switch to Bosnian" : "Switch to English"}
      >
        <span role="img" aria-hidden="true">
          {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
        </span>
      </motion.button>
    </MagnetButton>
  );
};
