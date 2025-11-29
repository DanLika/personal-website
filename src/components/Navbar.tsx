import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
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

  const navLinks = [
    { key: "home", label: t("nav.links.home") },
    { key: "projects", label: t("nav.links.projects") },
    { key: "about", label: t("nav.links.about") },
    { key: "contact", label: t("nav.links.contact") },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between w-full px-8 pt-6 pb-4 text-sm">
        {/* Logo */}
        <div className="text-3xl font-semibold shadow-[0_0_8px_rgba(59,201,255,0.8)] text-neon">
          licanin
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-xs text-white/70">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.key}>
              <Link to={link.key === "home" ? "/" : `/${link.key}`}>
                <MagnetButton
                  magnetStrength={6}
                  padding={60}
                  activeTransition="transform 0.2s ease-out"
                  inactiveTransition="transform 0.4s ease-in-out"
                  className="relative"
                >
                  <motion.span
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {link.label}
                  </motion.span>
                </MagnetButton>
              </Link>
              {index < navLinks.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="text-white/20"
                >
                  /
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Language Toggle */}
        <MagnetButton
          magnetStrength={4}
          padding={50}
          activeTransition="transform 0.2s ease-out"
          inactiveTransition="transform 0.4s ease-in-out"
          className="rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
        >
          <motion.button
            onClick={toggleLang}
            className="w-12 h-12 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <img
              src="/globe.png"
              alt="Language Toggle"
              className="w-12 h-12 object-contain"
            />
          </motion.button>
        </MagnetButton>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-20 bg-black border-b border-white/5">
        {/* Logo */}
        <div className="text-2xl font-semibold shadow-[0_0_8px_rgba(59,201,255,0.8)] text-neon">
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
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 z-40 p-4"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-[20px] border border-white/10 p-6">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    to={link.key === "home" ? "/" : `/${link.key}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-white/70 hover:text-white transition-colors duration-300 py-2"
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Mobile Language Toggle */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <motion.button
                  onClick={toggleLang}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src="/globe.png"
                    alt="Language Toggle"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-white/70 text-sm">
                    {i18n.language === "en" ? "EN" : "BS"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
