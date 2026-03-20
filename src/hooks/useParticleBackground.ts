import { useEffect, useRef, useState } from "react";

export const useParticleBackground = () => {
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  // Detect mobile for particle optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle page visibility - reinitialize particles when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, reinitialize particles to fix any WebGL context issues
        setParticleKey(prev => prev + 1);
      }
    };

    const handleContextLost = () => {
      // WebGL context was lost, reinitialize particles
      setParticleKey(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('particles-context-lost', handleContextLost);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('particles-context-lost', handleContextLost);
    };
  }, []);

  // Window-level mouse/touch tracking for particles with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const THROTTLE_MS = 16;
    let pendingX = 0;
    let pendingY = 0;

    const updatePosition = () => {
      rafId = null;
      lastUpdate = performance.now();
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = -((e.clientY / window.innerHeight) * 2 - 1);
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) {
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
        return;
      }
      lastUpdate = now;
      mouseRef.current = { x: pendingX, y: pendingY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pendingX = (touch.clientX / window.innerWidth) * 2 - 1;
        pendingY = -((touch.clientY / window.innerHeight) * 2 - 1);
        const now = performance.now();
        if (now - lastUpdate < THROTTLE_MS) {
          if (!rafId) rafId = requestAnimationFrame(updatePosition);
          return;
        }
        lastUpdate = now;
        mouseRef.current = { x: pendingX, y: pendingY };
      }
    };

    const handleEnd = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleEnd);
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { isMobile, particleKey, mouseRef };
};