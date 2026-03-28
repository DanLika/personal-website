/**
 * Core font size calculation logic, extracted for testability
 * independent of DOM environment constraints.
 */
export const calculateOptimalFontSize = (
  minFontSize: number,
  maxFontSize: number,
  maxLines: number,
  step: number,
  baseLineHeight: number,
  measureScrollHeight: (testSize: number) => number
): number => {
  const lineHeightRatio = baseLineHeight / maxFontSize;

  // Binary search for optimal font size
  let low = minFontSize;
  let high = maxFontSize;
  let optimalSize = minFontSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / step) * step;
    const testSize = Math.max(mid, minFontSize);

    // Calculate max height for this font size
    const currentLineHeight = testSize * lineHeightRatio;
    const maxHeight = currentLineHeight * maxLines;

    // Measure actual scrollHeight for this test size
    const scrollHeight = measureScrollHeight(testSize);
    const fits = scrollHeight <= maxHeight;

    if (fits) {
      optimalSize = testSize;
      low = mid + step;
    } else {
      high = mid - step;
    }

    // Break if we've converged
    if (high - low < step) break;
  }

  // Final verification pass calculation logic without DOM writes inside the loop
  const finalLineHeight = optimalSize * lineHeightRatio;
  const finalMaxHeight = finalLineHeight * maxLines;
  const finalScrollHeight = measureScrollHeight(optimalSize);

  if (finalScrollHeight > finalMaxHeight && optimalSize > minFontSize) {
    optimalSize = Math.max(optimalSize - step, minFontSize);
  }

  return optimalSize;
};
