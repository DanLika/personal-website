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
 * - CSS-based shimmer effect (no Framer Motion for faster initial load)
 * - Glow intensifies on hover (via CSS)
 * - CSS scale animation on hover/active
 */
export const CTAButton = ({
  children,
  onClick,
  className = "",
  disabled = false
}: CTAButtonProps) => {
  return (
    <button
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
        transition-all duration-300 ease-out
        shadow-[0_0_20px_rgba(59,201,255,0.4),0_4px_15px_rgba(0,0,0,0.3)]
        hover:shadow-[0_0_30px_rgba(59,201,255,0.6),0_0_60px_rgba(59,201,255,0.3),0_6px_20px_rgba(0,0,0,0.4)]
        hover:scale-[1.03]
        active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BC9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
    >
      {/* Shimmer effect overlay - CSS animation */}
      <div
        className="absolute inset-0 z-0 animate-shimmer"
        style={{
          background: "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 80%)",
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
    </button>
  );
};

export default CTAButton;
