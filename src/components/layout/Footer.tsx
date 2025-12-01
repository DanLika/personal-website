import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { MagnetButton } from "../ui/MagnetButton";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const smoothScrollTo = (sectionId: string) => {
    // Check if we're on the homepage
    if (location.pathname === '/') {
      // If on homepage, scroll directly to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If on case study or other page, navigate to homepage with hash using React Router
      navigate(`/#${sectionId}`);
      // Scroll to section after navigation completes
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const footerLinks = [
    { name: t("nav.links.home"), sectionId: "home" },
    { name: t("nav.links.projects"), sectionId: "projects" },
    { name: t("nav.links.about"), sectionId: "about" },
    { name: t("nav.links.blog"), route: "/blog" },
    { name: t("nav.links.contact"), sectionId: "contact" }
  ];

  return (
    <footer className="relative w-full bg-black border-t border-white/10 backdrop-blur-md">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/3 via-transparent to-blue-500/3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">

          {/* Left - Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/40 text-sm font-light"
          >
            <p>{t("footer.rights")}</p>
          </motion.div>

          {/* Center - Tech Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex"
          >
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
              <span className="text-white/60 text-xs font-medium tracking-wide">
                {t("footer.builtWith")}
              </span>
            </div>
          </motion.div>

          {/* Right - Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
              >
                <MagnetButton
                  magnetStrength={4}
                  padding={20}
                  activeTransition="transform 0.2s ease-out"
                  inactiveTransition="transform 0.4s ease-in-out"
                  className="relative"
                >
                  <button
                    onClick={() => {
                      if ('route' in link && link.route) {
                        navigate(link.route);
                      } else if ('sectionId' in link && link.sectionId) {
                        smoothScrollTo(link.sectionId);
                      }
                    }}
                    className="text-white/50 text-sm font-light hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </MagnetButton>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-4 text-center">

          {/* Tech Badge - First on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex"
          >
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
              <span className="text-white/60 text-xs font-medium tracking-wide">
                {t("footer.builtWith")}
              </span>
            </div>
          </motion.div>

          {/* Navigation Links - Center on Mobile */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
              >
                <MagnetButton
                  magnetStrength={4}
                  padding={20}
                  activeTransition="transform 0.2s ease-out"
                  inactiveTransition="transform 0.4s ease-in-out"
                  className="relative"
                >
                  <button
                    onClick={() => {
                      if ('route' in link && link.route) {
                        navigate(link.route);
                      } else if ('sectionId' in link && link.sectionId) {
                        smoothScrollTo(link.sectionId);
                      }
                    }}
                    className="text-white/50 text-sm font-light hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </MagnetButton>
              </motion.div>
            ))}
          </motion.nav>

          {/* Copyright - Last on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white/40 text-xs font-light"
          >
            <p>{t("footer.rights")}</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
