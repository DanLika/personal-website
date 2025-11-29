import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-neon mb-8">
          {t("nav.links.about")}
        </h1>
        <p className="text-white/70 text-lg">
          About page coming soon...
        </p>
      </motion.div>
    </div>
  );
};
