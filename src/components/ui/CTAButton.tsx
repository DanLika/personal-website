import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * CTAButton - Primary call-to-action button with neon glow and shimmer effect
 *
 * Features:
 * - Filled cyan background matching the neon theme
 * - Animated shimmer effect on hover
 * - Glow intensifies on hover (via CSS)
 * - Subtle scale animation on hover/tap
 * - Smooth spring animations
 */
export const CTAButton = ({
  children,
  onClick,
  className = "",
  disabled = false
}: CTAButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-6 sm:px-8 md:px-10
        py-3 sm:py-3.5 md:py-4
        text-sm sm:text-base font-semibold
        rounded-full
        bg-gradient-to-r from-[#3BC9FF] to-[#2AB8F0]
        text-[#0A0A0A]
        flex items-center justify-center gap-1.5 sm:gap-2
        transition-shadow duration-300
        shadow-[0_0_20px_rgba(59,201,255,0.4),0_4px_15px_rgba(0,0,0,0.3)]
        hover:shadow-[0_0_30px_rgba(59,201,255,0.6),0_0_60px_rgba(59,201,255,0.3),0_6px_20px_rgba(0,0,0,0.4)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BC9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      initial={{ scale: 1 }}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Shimmer effect overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 80%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: ["−100%", "100%"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
        {children}
      </span>

      {/* Inner highlight for depth */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
        }}
      />
    </motion.button>
  );
};

export default CTAButton;
