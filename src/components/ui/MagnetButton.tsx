import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useMagnet } from "../../hooks/useMagnet";

interface MagnetButtonProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export const MagnetButton = ({
  children,
  className = "",
  padding = 100,
  disabled = false,
  magnetStrength = 4,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
}: MagnetButtonProps) => {
  const magnetRef = useRef<HTMLDivElement>(null);

  const { isActive, position } = useMagnet({
    magnetRef,
    padding,
    disabled,
    magnetStrength,
  });

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={`${wrapperClassName} ${className}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
