import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MagnetButton } from "./ui/MagnetButton";

/**
 * Navbar - Floating pill-style navigation with hide/show on scroll
 * 
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Always visible at top of page
 * - Glass morphism styling
 * - Responsive with mobile hamburger menu
 * - Smooth scroll to sections
 */
export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollThreshold = 50; // Minimum scroll before hiding

    // Check if at top of page
    setIsAtTop(currentScrollY < 10);

    // Determine visibility based on scroll direction
    if (currentScrollY < scrollThreshold) {
      // Always show at top
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      // Scrolling down - hide navbar
      setIsVisible(false);
      // Also close mobile menu when hiding
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show navbar
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bs" : "en");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const smoothScrollTo = (sectionId: string) => {
    // Check if we're on the homepage
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // If on case study or other page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  const navLinks = [
    { key: "home", label: t("nav.links.home"), sectionId: "hero" },
    { key: "projects", label: t("nav.links.projects"), sectionId: "projects" },
    { key: "about", label: t("nav.links.about"), sectionId: "about" },
    { key: "contact", label: t("nav.links.contact"), sectionId: "contact" },
  ];

  // Animation variants for navbar visibility
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  } as const;

  // Glass morphism styles - shared between desktop and mobile
  const glassStyles = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: isAtTop
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
      : "0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
  };

  return (
    <>
      {/* Desktop Navbar - Floating Pill Style */}
      <motion.nav
        variants={navbarVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="hidden md:block fixed top-6 left-0 right-0 z-50"
      >
        <div className="flex justify-center">
          <div
            className="rounded-full px-8 py-3 flex items-center gap-8 transition-shadow duration-300"
            style={glassStyles}
          >
            {/* Logo */}
            <motion.div
              className="text-xl font-bold text-neon cursor-pointer"
              style={{
                textShadow: "0 0 10px rgba(59, 201, 255, 0.6)",
              }}
              whileHover={{
                textShadow: "0 0 20px rgba(59, 201, 255, 0.9)",
              }}
              onClick={() => smoothScrollTo("hero")}
            >
              licanin
            </motion.div>

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
                        }}
                        transition={{ duration: 0.2 }}
                        className="block hover:text-neon transition-all duration-300 cursor-pointer"
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

            {/* Language Toggle with Globe Icon */}
            <MagnetButton
              magnetStrength={4}
              padding={50}
              activeTransition="transform 0.2s ease-out"
              inactiveTransition="transform 0.4s ease-in-out"
            >
              <motion.button
                onClick={toggleLang}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                title={i18n.language === "en" ? "Switch to Bosnian" : "Switch to English"}
              >
                <img
                  src="/globe.avif"
                  alt="Change Language"
                  className="w-5 h-5 object-contain opacity-80"
                />
              </motion.button>
            </MagnetButton>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar - Floating Pill Style */}
      <motion.nav
        variants={navbarVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="md:hidden fixed top-4 left-4 right-4 z-50"
      >
        <div
          className="rounded-full px-4 py-2.5 flex items-center justify-between"
          style={glassStyles}
        >
          {/* Logo */}
          <motion.div
            className="text-base font-bold text-neon cursor-pointer"
            style={{
              textShadow: "0 0 10px rgba(59, 201, 255, 0.6)",
            }}
            onClick={() => {
              smoothScrollTo("hero");
              setMobileMenuOpen(false);
            }}
          >
            licanin
          </motion.div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-neon transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
          </button>
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
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel - Glass morphism effect */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className="md:hidden fixed top-20 left-4 right-4 z-50 rounded-[24px] p-6 overflow-hidden"
              style={{
                background: "rgba(15, 15, 20, 0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Navigation Links */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      smoothScrollTo(link.sectionId);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left group"
                  >
                    <motion.div
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between text-white/70 hover:text-white transition-colors duration-300 py-3 px-2 rounded-xl hover:bg-white/5"
                    >
                      <span className="text-base">{link.label}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-neon"
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Mobile Language Toggle */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={toggleLang}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/globe.avif"
                  alt="Change Language"
                  className="w-5 h-5 object-contain opacity-80"
                />
                <span className="text-white/70 text-sm">
                  {i18n.language === "en" ? "English" : "Bosanski"}
                </span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;