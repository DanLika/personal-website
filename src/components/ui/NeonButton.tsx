import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const NeonButton = ({
  children,
  variant = "primary",
  className = "",
  ...rest
}: NeonButtonProps) => {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300";

  const variantClasses =
    variant === "primary"
      ? "bg-neon text-obsidian shadow-neon hover:shadow-[0_0_30px_rgba(59,201,255,0.8)]"
      : "bg-transparent border border-neon text-neon shadow-[0_0_20px_#3BC9FF] hover:bg-neon/10";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
