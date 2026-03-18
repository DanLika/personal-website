import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { i18n } from "i18next";
import type { NavigateFunction } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import type { NavLink } from "./types";
import { LanguageSelector } from "./LanguageSelector";

interface DesktopMenuProps {
  isVisible: boolean;
  navbarVariants: Variants;
  glassStyles: React.CSSProperties;
  smoothScrollTo: (sectionId: string) => void;
  navLinks: NavLink[];
  navigate: NavigateFunction;
  toggleLang: () => void;
  i18n: i18n;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({
  isVisible,
  navbarVariants,
  glassStyles,
  smoothScrollTo,
  navLinks,
  navigate,
  toggleLang,
  i18n,
}) => {
  return (
    <motion.nav
      variants={navbarVariants}
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      className="hidden md:block fixed top-6 left-0 right-0 z-50"
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="flex justify-center">
        <div
          className="rounded-full px-8 py-3 flex items-center gap-8"
          style={{
            ...glassStyles,
            transition:
              "background 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border 0.3s ease-in-out",
          }}
        >
          {/* Logo */}
          <motion.div
            className="text-xl md:text-2xl lg:text-3xl font-bold text-neon cursor-pointer"
            style={{
              textShadow: "0 0 10px rgba(59, 201, 255, 0.6)",
            }}
            initial={{ textShadow: "0 0 10px rgba(59, 201, 255, 0.6)" }}
            whileHover={{
              textShadow: "0 0 20px rgba(59, 201, 255, 0.9)",
            }}
            transition={{ duration: 0.2 }}
            onClick={() => smoothScrollTo("home")}
          >
            licanin
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm text-white/80">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.key}>
                <button
                  onClick={() => {
                    if (link.route) {
                      navigate(link.route);
                    } else if (link.sectionId) {
                      smoothScrollTo(link.sectionId);
                    }
                  }}
                >
                  <MagnetButton
                    magnetStrength={8}
                    padding={60}
                    activeTransition="transform 0.2s ease-out"
                    inactiveTransition="transform 0.4s ease-in-out"
                    className="relative"
                  >
                    <motion.span
                      initial={{ scale: 1, color: "rgba(255, 255, 255, 0.8)" }}
                      whileHover={{
                        scale: 1.05,
                        color: "#3BC9FF",
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="block cursor-pointer"
                    >
                      {link.label}
                    </motion.span>
                  </MagnetButton>
                </button>
                {index < navLinks.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Language Toggle with Flag Emoji */}
          <MagnetButton
            magnetStrength={4}
            padding={50}
            activeTransition="transform 0.2s ease-out"
            inactiveTransition="transform 0.4s ease-in-out"
          >
            <LanguageSelector i18n={i18n} toggleLang={toggleLang} />
          </MagnetButton>
        </div>
      </div>
    </motion.nav>
  );
};
