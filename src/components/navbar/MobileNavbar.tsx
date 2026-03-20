import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface MobileNavbarProps {
  isVisible: boolean;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  smoothScrollTo: (sectionId: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleLang: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navbarVariants: any; // framer-motion variants
  glassStyles: React.CSSProperties;
}

export const MobileNavbar = ({
  isVisible,
  mobileMenuOpen,
  toggleMobileMenu,
  smoothScrollTo,
  setMobileMenuOpen,
  toggleLang,
  navbarVariants,
  glassStyles,
}: MobileNavbarProps) => {
  const { i18n } = useTranslation();

  return (
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
              toggleMobileMenu();
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
  );
};
