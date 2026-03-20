import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { NavLink } from "./DesktopNavLinks";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navLinks: NavLink[];
  onNavigate: (link: NavLink) => void;
  toggleLang: () => void;
}

export const MobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  navLinks,
  onNavigate,
  toggleLang,
}: MobileMenuProps) => {
  const { i18n } = useTranslation();

  return (
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
                    onNavigate(link);
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
  );
};
