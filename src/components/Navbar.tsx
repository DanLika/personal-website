import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MagnetButton } from "./ui/MagnetButton";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bs" : "en");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const smoothScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { key: "home", label: t("nav.links.home"), sectionId: "hero" },
    { key: "projects", label: t("nav.links.projects"), sectionId: "projects" },
    { key: "about", label: t("nav.links.about"), sectionId: "about" },
    { key: "contact", label: t("nav.links.contact"), sectionId: "contact" },
  ];

  return (
    <>
      {/* Desktop Navbar - Floating Pill Style */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-8 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex items-center gap-8">
          {/* Logo */}
          <div className="text-xl font-bold text-neon drop-shadow-[0_0_8px_rgba(59,201,255,0.8)]">
            licanin
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm text-white/80">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.key}>
                <button onClick={() => smoothScrollTo(link.sectionId)}>
                  <MagnetButton
                    magnetStrength={8}
                    padding={60}
                    activeTransition="transform 0.2s ease-out"
                    inactiveTransition="transform 0.4s ease-in-out"
                    className="relative"
                  >
                    <motion.span
                      whileHover={{
                        scale: 1.05,
                        color: "#3BC9FF",
                        textShadow: "0 0 8px rgba(59,201,255,0.6)"
                      }}
                      transition={{ duration: 0.2 }}
                      className="block hover:text-neon transition-all duration-300 cursor-pointer"
                    >
                      {link.label}
                    </motion.span>
                  </MagnetButton>
                </button>
                {index < navLinks.length - 1 && (
                  <span className="text-white/30">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Language Toggle with Globe Icon */}
          <MagnetButton
            magnetStrength={4}
            padding={50}
            activeTransition="transform 0.2s ease-out"
            inactiveTransition="transform 0.4s ease-in-out"
          >
            <motion.button
              onClick={toggleLang}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              title={i18n.language === "en" ? "Switch to Bosnian" : "Switch to English"}
            >
              <img
                src="/globe.avif"
                alt="Change Language"
                className="w-6 h-6 object-contain filter brightness-[0.9] saturate-[1.2]"
              />
            </motion.button>
          </MagnetButton>
        </div>
      </nav>


      {/* Mobile Navbar - Floating Pill Style */}
      <nav className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)]">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex items-center justify-between">
          {/* Logo */}
          <div className="text-lg font-bold text-neon drop-shadow-[0_0_8px_rgba(59,201,255,0.8)]">
            licanin
          </div>

          {/* Hamburger Menu Button */}
          <MagnetButton
            magnetStrength={4}
            padding={40}
            activeTransition="transform 0.2s ease-out"
            inactiveTransition="transform 0.3s ease-in-out"
          >
            <motion.button
              onClick={toggleMobileMenu}
              className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-neon transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </MagnetButton>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-24 left-0 right-0 z-40 p-4"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-[20px] border border-white/10 p-6">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => {
                      smoothScrollTo(link.sectionId);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-white/70 hover:text-white transition-colors duration-300 py-2"
                    >
                      {link.label}
                    </motion.div>
                  </button>
                ))}
              </div>

              {/* Mobile Language Toggle with Globe Icon */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <motion.button
                  onClick={toggleLang}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-white/20 bg-transparent hover:bg-white/10 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src="/globe.avif"
                    alt="Change Language"
                    className="w-6 h-6 object-contain filter brightness-[0.9] saturate-[1.2]"
                  />
                  <span className="text-white/70">{i18n.language === "en" ? "English" : "Bosanski"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
