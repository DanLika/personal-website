import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const NotFoundPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "bs";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{
              textShadow: "0 0 60px rgba(59, 201, 255, 0.5)",
            }}
          >
            404
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {lang === "bs" ? "Stranica nije pronađena" : "Page Not Found"}
        </h1>

        {/* Description */}
        <p className="text-white/60 mb-8">
          {lang === "bs"
            ? "Stranica koju tražite ne postoji ili je premještena."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-400 text-sm font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {lang === "bs" ? "Početna" : "Go Home"}
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "bs" ? "Nazad" : "Go Back"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
