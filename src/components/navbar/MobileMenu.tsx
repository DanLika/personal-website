import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { i18n } from "i18next";
import type { NavigateFunction } from "react-router-dom";
import type { NavLink } from "./types";

interface MobileMenuProps {
  isVisible: boolean;
  navbarVariants: Variants;
  glassStyles: React.CSSProperties;
  smoothScrollTo: (sectionId: string) => void;
  navLinks: NavLink[];
  navigate: NavigateFunction;
  toggleLang: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  i18n: i18n;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isVisible,
  navbarVariants,
  glassStyles,
  smoothScrollTo,
  navLinks,
  navigate,
  toggleLang,
  mobileMenuOpen,
  setMobileMenuOpen,
  i18n,
}) => {
  return (
    <>
      {/* Mobile Navbar - Floating Pill Style */}
      <motion.nav
        variants={navbarVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="md:hidden fixed top-4 left-4 right-4 z-[60] pointer-events-auto"
        style={{
          willChange: "transform, opacity",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          pointerEvents: "auto",
        }}
      >
        <div
          className="rounded-full px-4 py-2.5 flex items-center justify-between pointer-events-auto"
          style={{
            ...glassStyles,
            transition:
              "background 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border 0.3s ease-in-out",
          }}
        >
          {/* Logo */}
          <motion.div
            className="text-lg sm:text-xl font-bold text-neon cursor-pointer"
            style={{
              textShadow: "0 0 10px rgba(59, 201, 255, 0.6)",
            }}
            onClick={() => {
              smoothScrollTo("home");
              setMobileMenuOpen(false);
            }}
          >
            licanin
          </motion.div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLang}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 text-xl"
              whileTap={{ scale: 0.95 }}
              aria-label={
                i18n.language === "en"
                  ? "Switch to Bosnian language"
                  : "Switch to English language"
              }
            >
              <span role="img" aria-hidden="true">
                {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
              </span>
            </motion.button>

            {/* Hamburger Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-neon transition-colors relative z-[70] pointer-events-auto"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel - Glass morphism effect */}
            <motion.nav
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: "easeOut",
              }}
              className="md:hidden fixed top-20 left-4 right-4 z-[60] rounded-[24px] p-6 overflow-hidden"
              style={{
                background: "rgba(15, 15, 20, 0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Navigation Links */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => {
                      if (link.route) {
                        navigate(link.route);
                      } else if (link.sectionId) {
                        smoothScrollTo(link.sectionId);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="text-left group"
                  >
                    <div className="flex items-center justify-between text-white/70 hover:text-white transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-white/5">
                      <span className="text-base">{link.label}</span>
                      <span className="text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLang}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
                aria-label={
                  i18n.language === "en"
                    ? "Switch to Bosnian language"
                    : "Switch to English language"
                }
              >
                <span role="img" aria-hidden="true" className="text-2xl">
                  {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
                </span>
                <span className="text-white/70 text-sm">
                  {i18n.language === "en" ? "English" : "Bosanski"}
                </span>
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
