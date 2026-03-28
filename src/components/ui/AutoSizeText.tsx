import { useRef, useEffect, useState, type ReactNode } from 'react';
import { calculateOptimalFontSize } from './AutoSizeText.utils';

interface AutoSizeTextProps {
  children: ReactNode;
  /** Minimum font size in pixels */
  minFontSize?: number;
  /** Maximum font size in pixels */
  maxFontSize?: number;
  /** Maximum number of lines */
  maxLines?: number;
  /** Additional CSS classes */
  className?: string;
  /** Step size for font reduction */
  step?: number;
}

/**
 * AutoSizeText - Automatically sizes text to fit within container
 *
 * Similar to Flutter's AutoSizeText widget:
 * - Reduces font size until text fits within maxLines
 * - Respects minFontSize and maxFontSize bounds
 * - Uses binary search to minimize reflows
 *
 * @example
 * ```tsx
 * <AutoSizeText maxLines={2} minFontSize={12} maxFontSize={18}>
 *   Long text that should fit in 2 lines
 * </AutoSizeText>
 * ```
 */
export const AutoSizeText = ({
  children,
  minFontSize = 12,
  maxFontSize = 22,
  maxLines = 2,
  className = '',
  step = 1,
}: AutoSizeTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    const calculateFontSize = () => {
      // Cancel any pending RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Use RAF to batch DOM reads/writes
      rafIdRef.current = requestAnimationFrame(() => {
        // Get computed line height once
        const computedStyle = window.getComputedStyle(text);
        const baseLineHeight = parseFloat(computedStyle.lineHeight) || maxFontSize * 1.5;

        // Measure callback to evaluate size in the DOM
        const measureScrollHeight = (testSize: number) => {
          text.style.fontSize = `${testSize}px`;
          return text.scrollHeight;
        };

        const optimalSize = calculateOptimalFontSize(
          minFontSize,
          maxFontSize,
          maxLines,
          step,
          baseLineHeight,
          measureScrollHeight
        );

        setFontSize(optimalSize);
        // Ensure the final state is applied in the DOM to avoid visual lag before React updates state
        text.style.fontSize = `${optimalSize}px`;
      });
    };

    // Calculate on mount
    calculateFontSize();

    // Debounced resize observer to prevent excessive calculations
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateFontSize, 100);
    });

    resizeObserver.observe(container);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeObserver.disconnect();
    };
  }, [children, minFontSize, maxFontSize, maxLines, step]);

  return (
    <div ref={containerRef} className={className}>
      <span
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          display: 'block',
          lineHeight: 1.5,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default AutoSizeText;
