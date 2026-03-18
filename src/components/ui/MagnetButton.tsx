import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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
  const [isActive, setIsActive] = useState<boolean>(false);
  const isActiveRef = useRef<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Cache rect on mount and resize
  const updateCachedRect = useCallback(() => {
    if (magnetRef.current) {
      cachedRectRef.current = magnetRef.current.getBoundingClientRect();
    }
  }, []);

  // Update cached rect on scroll and resize
  useEffect(() => {
    updateCachedRect();

    const handleScrollOrResize = () => {
      // Debounce rect updates
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updateCachedRect);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateCachedRect]);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      if (rafIdRef.current) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;

        const mouse = lastMouseRef.current;
        if (!mouse) return;

        let rect = cachedRectRef.current;
        if (!rect) {
          if (magnetRef.current) {
            cachedRectRef.current = magnetRef.current.getBoundingClientRect();
            rect = cachedRectRef.current;
          }
        }

        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = Math.abs(centerX - mouse.x);
        const distY = Math.abs(centerY - mouse.y);

        const isInside = distX < rect.width / 2 + padding && distY < rect.height / 2 + padding;

        if (isInside) {
          const offsetX = (mouse.x - centerX) / magnetStrength;
          const offsetY = (mouse.y - centerY) / magnetStrength;
          setPosition({ x: offsetX, y: offsetY });
          if (!isActiveRef.current) {
            isActiveRef.current = true;
            setIsActive(true);
          }
        } else {
          if (isActiveRef.current) {
            setPosition({ x: 0, y: 0 });
            isActiveRef.current = false;
            setIsActive(false);
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setPosition({ x: 0, y: 0 });
    };
  }, [padding, disabled, magnetStrength]);

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
