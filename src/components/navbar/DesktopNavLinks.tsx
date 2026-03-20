import React from "react";
import { motion } from "framer-motion";
import { MagnetButton } from "../ui/MagnetButton";

// Define NavLink type appropriately since it can have route or sectionId
export type NavLink = {
  key: string;
  label: string;
} & (
  | { route: string; sectionId?: never }
  | { sectionId: string; route?: never }
);

interface DesktopNavLinksProps {
  navLinks: NavLink[];
  onNavigate: (link: NavLink) => void;
}

export const DesktopNavLinks = ({ navLinks, onNavigate }: DesktopNavLinksProps) => {
  return (
    <div className="flex items-center gap-6 text-sm text-white/80">
      {navLinks.map((link, index) => (
        <React.Fragment key={link.key}>
          <button onClick={() => onNavigate(link)}>
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
  );
};
