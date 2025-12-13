import { useRef, useEffect, useState, type ReactNode } from 'react';

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
        const lineHeightRatio = baseLineHeight / maxFontSize;

        // Binary search for optimal font size (reduces reflows from N to log(N))
        let low = minFontSize;
        let high = maxFontSize;
        let optimalSize = minFontSize;

        // Batch all measurements in a single frame
        while (low <= high) {
          const mid = Math.floor((low + high) / step) * step;
          const testSize = Math.max(mid, minFontSize);

          // Apply size
          text.style.fontSize = `${testSize}px`;

          // Calculate max height for this font size
          const currentLineHeight = testSize * lineHeightRatio;
          const maxHeight = currentLineHeight * maxLines;

          // Read scrollHeight once per iteration
          const fits = text.scrollHeight <= maxHeight;

          if (fits) {
            optimalSize = testSize;
            low = mid + step;
          } else {
            high = mid - step;
          }

          // Break if we've converged
          if (high - low < step) break;
        }

        // Final verification pass
        text.style.fontSize = `${optimalSize}px`;
        const finalLineHeight = optimalSize * lineHeightRatio;
        const finalMaxHeight = finalLineHeight * maxLines;

        if (text.scrollHeight > finalMaxHeight && optimalSize > minFontSize) {
          optimalSize = Math.max(optimalSize - step, minFontSize);
        }

        setFontSize(optimalSize);
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
