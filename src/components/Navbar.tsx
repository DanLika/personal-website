import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { MobileMenu } from "./navbar/MobileMenu";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);

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
    const newLang = i18n.language === "en" ? "bs" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
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

  // Animation variants for navbar visibility - memoized to prevent recreation
  // Using tween instead of spring to prevent bouncy/glitchy appearance
  const navbarVariants = useMemo(() => ({
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween" as const,
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: "tween" as const,
        duration: 0.25,
        ease: "easeIn" as const,
      },
    },
  }), []);

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
        Skip to main content
      </a>

      <DesktopMenu
        isVisible={isVisible}
        navbarVariants={navbarVariants}
        glassStyles={glassStyles}
        smoothScrollTo={smoothScrollTo}
        navLinks={navLinks}
        navigate={navigate}
        toggleLang={toggleLang}
        i18n={i18n}
      />
      <MobileMenu
        isVisible={isVisible}
        navbarVariants={navbarVariants}
        glassStyles={glassStyles}
        smoothScrollTo={smoothScrollTo}
        navLinks={navLinks}
        navigate={navigate}
        toggleLang={toggleLang}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        i18n={i18n}
      />
    </>
  );
};

export default Navbar;