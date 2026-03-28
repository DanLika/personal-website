import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Navbar - Floating pill-style navigation with hide/show on scroll
 *
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Always visible at top of page
 * - Glass morphism styling
 * - Responsive with mobile hamburger menu
 * - Smooth scroll to sections
 * - CSS-only animations (no Framer Motion for faster initial load)
 */
export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Track previous visibility to detect changes
  const prevIsVisibleRef = useRef(true);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollThreshold = 50;

    // Batch state updates
    const newIsAtTop = currentScrollY < 10;
    let newIsVisible = prevIsVisibleRef.current;

    if (currentScrollY < scrollThreshold) {
      newIsVisible = true;
    } else if (currentScrollY > lastScrollYRef.current && currentScrollY > scrollThreshold) {
      newIsVisible = false;
    } else if (currentScrollY < lastScrollYRef.current) {
      newIsVisible = true;
    }

    lastScrollYRef.current = currentScrollY;

    // Close mobile menu when navbar hides (integrated into scroll handler)
    if (!newIsVisible && prevIsVisibleRef.current && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    prevIsVisibleRef.current = newIsVisible;

    // Batch state updates to single re-render
    if (newIsAtTop !== isAtTop || newIsVisible !== isVisible) {
      setIsAtTop(newIsAtTop);
      setIsVisible(newIsVisible);
    }
  }, [isVisible, isAtTop, mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on escape key and return focus to hamburger
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Focus first menu item when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      const firstButton = menuRef.current.querySelector<HTMLButtonElement>("button");
      firstButton?.focus();
    }
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
    const newLang = i18n.language === "en" ? "bs" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const smoothScrollTo = (sectionId: string) => {
    // Check if we're on the homepage
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // If on case study or other page, navigate to homepage with hash using React Router
      navigate(`/#${sectionId}`);
      // Scroll to section after navigation completes
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const navLinks = [
    { key: "home", label: t("nav.links.home"), sectionId: "home" },
    { key: "projects", label: t("nav.links.projects"), sectionId: "projects" },
    { key: "about", label: t("nav.links.about"), sectionId: "about" },
    { key: "blog", label: t("nav.links.blog"), route: "/blog" },
    { key: "contact", label: t("nav.links.contact"), sectionId: "contact" },
  ];

  // Glass morphism styles - shared between desktop and mobile
  // Using dark semi-transparent background to ensure readability over light content
  const glassStyles = {
    background: isAtTop
      ? "rgba(10, 10, 15, 0.6)"  // More transparent at top (hero is dark)
      : "rgba(10, 10, 15, 0.85)", // More opaque when scrolled (content may be light)
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: isAtTop
      ? "0 4px 20px 0 rgba(0, 0, 0, 0.2)"
      : "0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
  };

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {t("nav_a11y.skipToContent")}
      </a>

      {/* Desktop Navbar - Floating Pill Style */}
      <nav
        className={`hidden md:block fixed top-6 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        <div className="flex justify-center">
          <div
            className="rounded-full px-8 py-3 flex items-center gap-8 transition-all duration-300"
            style={glassStyles}
          >
            {/* Logo */}
            <div
              className="text-xl md:text-2xl lg:text-3xl font-bold text-neon cursor-pointer transition-all duration-200 hover:drop-shadow-[0_0_20px_rgba(59,201,255,0.9)]"
              style={{
                textShadow: "var(--neon-text-glow)",
              }}
              onClick={() => smoothScrollTo("home")}
            >
              licanin
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6 text-sm text-white/80">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.key}>
                  <button
                    onClick={() => {
                      if ('route' in link && link.route) {
                        navigate(link.route);
                      } else if ('sectionId' in link && link.sectionId) {
                        smoothScrollTo(link.sectionId);
                      }
                    }}
                    className="text-white/80 hover:text-neon hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:rounded-md"
                  >
                    {link.label}
                  </button>
                  {index < navLinks.length - 1 && (
                    <span className="text-white/20">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Language Toggle with Flag Emoji */}
            <button
              onClick={toggleLang}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 text-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              aria-label={i18n.language === "en" ? "Switch to Bosnian language" : "Switch to English language"}
              title={i18n.language === "en" ? "Switch to Bosnian" : "Switch to English"}
            >
              <span role="img" aria-hidden="true">
                {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Floating Pill Style */}
      <nav
        className={`md:hidden fixed left-4 right-4 z-[60] pointer-events-auto transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          top: "max(16px, env(safe-area-inset-top, 16px))",
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="rounded-full px-4 py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300"
          style={glassStyles}
        >
          {/* Logo */}
          <div
            className="text-lg sm:text-xl font-bold text-neon cursor-pointer"
            style={{
              textShadow: "var(--neon-text-glow)",
            }}
            onClick={() => {
              smoothScrollTo("home");
              setMobileMenuOpen(false);
            }}
          >
            licanin
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 text-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              aria-label={i18n.language === "en" ? "Switch to Bosnian language" : "Switch to English language"}
            >
              <span role="img" aria-hidden="true">
                {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
              </span>
            </button>

            {/* Hamburger Menu Button */}
            <button
              ref={hamburgerRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
              }}
              className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-neon transition-colors relative z-[70] pointer-events-auto focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded-full"
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
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel - Glass morphism effect */}
          <nav
            ref={menuRef}
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
            className="md:hidden fixed top-20 left-4 right-4 z-[60] rounded-[24px] p-6 overflow-hidden animate-fade-in"
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
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => {
                    if ('route' in link && link.route) {
                      navigate(link.route);
                    } else if ('sectionId' in link && link.sectionId) {
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
              aria-label={i18n.language === "en" ? "Switch to Bosnian language" : "Switch to English language"}
            >
              <span role="img" aria-hidden="true" className="text-2xl">
                {i18n.language === "en" ? "🇺🇸" : "🇧🇦"}
              </span>
              <span className="text-white/70 text-sm">
                {i18n.language === "en" ? "English" : "Bosanski"}
              </span>
            </button>
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
