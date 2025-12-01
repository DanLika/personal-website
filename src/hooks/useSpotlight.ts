import { useRef, useCallback } from 'react';

interface SpotlightOptions {
  updateParent?: boolean;
}

/**
 * Custom hook for spotlight effect with RAF batching
 * Prevents layout thrashing by batching getBoundingClientRect calls
 */
export const useSpotlight = (options: SpotlightOptions = {}) => {
  const { updateParent = true } = options;
  const rafRef = useRef<number | null>(null);
  const pendingUpdate = useRef<{ x: number; y: number; target: HTMLElement } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Store pending update
    pendingUpdate.current = { x: clientX, y: clientY, target };

    // Skip if RAF already scheduled
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const pending = pendingUpdate.current;
      if (!pending) return;

      const rect = pending.target.getBoundingClientRect();
      const x = pending.x - rect.left;
      const y = pending.y - rect.top;

      // Batch all style updates together
      pending.target.style.setProperty('--mouse-x', `${x}px`);
      pending.target.style.setProperty('--mouse-y', `${y}px`);

      if (updateParent) {
        const parent = pending.target.parentElement;
        if (parent) {
          const glowDiv = parent.querySelector('div');
          if (glowDiv) {
            glowDiv.style.setProperty('--mouse-x', `${x}px`);
            glowDiv.style.setProperty('--mouse-y', `${y}px`);
          }
        }
      }

      pendingUpdate.current = null;
    });
  }, [updateParent]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    // Store pending update
    pendingUpdate.current = { x: clientX, y: clientY, target };

    // Skip if RAF already scheduled
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const pending = pendingUpdate.current;
      if (!pending) return;

      const rect = pending.target.getBoundingClientRect();
      const x = pending.x - rect.left;
      const y = pending.y - rect.top;

      // Batch all style updates together
      pending.target.style.setProperty('--mouse-x', `${x}px`);
      pending.target.style.setProperty('--mouse-y', `${y}px`);

      if (updateParent) {
        const parent = pending.target.parentElement;
        if (parent) {
          const glowDiv = parent.querySelector('div');
          if (glowDiv) {
            glowDiv.style.setProperty('--mouse-x', `${x}px`);
            glowDiv.style.setProperty('--mouse-y', `${y}px`);
          }
        }
      }

      pendingUpdate.current = null;
    });
  }, [updateParent]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return {
    handleMouseMove,
    handleTouchMove,
    cleanup,
  };
};
