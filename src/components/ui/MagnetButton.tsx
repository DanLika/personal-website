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
    // Only attach listener when active and not disabled
    if (disabled || !isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      // Use RAF for batching
      if (rafIdRef.current) return; // Skip if RAF already pending

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;

        const rect = cachedRectRef.current;
        const mouse = lastMouseRef.current;
        if (!rect || !mouse) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = Math.abs(centerX - mouse.x);
        const distY = Math.abs(centerY - mouse.y);

        if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
          const offsetX = (mouse.x - centerX) / magnetStrength;
          const offsetY = (mouse.y - centerY) / magnetStrength;
          setPosition({ x: offsetX, y: offsetY });
        } else {
          // Reset position and deactivate when mouse leaves area
          setPosition({ x: 0, y: 0 });
          setIsActive(false);
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
      // Reset position when effect cleans up (disabled or deactivated)
      setPosition({ x: 0, y: 0 });
    };
  }, [padding, disabled, magnetStrength, isActive]);

  // Separate effect to detect when mouse enters the proximity
  useEffect(() => {
    if (disabled) return;

    let enterRafId: number | null = null;

    const handleMouseEnter = (e: MouseEvent) => {
      if (isActive) return; // Already active, skip

      // Use RAF for batching
      if (enterRafId) return;

      enterRafId = requestAnimationFrame(() => {
        enterRafId = null;

        // Update rect before checking (fresh read on potential activation)
        if (magnetRef.current) {
          cachedRectRef.current = magnetRef.current.getBoundingClientRect();
        }

        const rect = cachedRectRef.current;
        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = Math.abs(centerX - e.clientX);
        const distY = Math.abs(centerY - e.clientY);

        if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
          setIsActive(true);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseEnter, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseEnter);
      if (enterRafId) {
        cancelAnimationFrame(enterRafId);
      }
    };
  }, [padding, disabled, isActive]);

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
