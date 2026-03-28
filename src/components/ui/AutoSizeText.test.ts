import { test, describe } from "node:test";
import * as assert from "node:assert";
import { calculateOptimalFontSize } from "./AutoSizeText.utils.ts";

describe("AutoSizeText font size calculation", () => {
  const minFontSize = 12;
  const maxFontSize = 22;
  const maxLines = 2;
  const step = 1;
  const baseLineHeight = 33; // 22 * 1.5

  test("returns maxFontSize if text fits easily at max size", () => {
    // If text always fits, measureScrollHeight should return a small value.
    // Max height for maxFontSize (22) is: 22 * 1.5 * 2 = 66
    const measureScrollHeight = () => 50; // less than 66

    const optimalSize = calculateOptimalFontSize(
      minFontSize,
      maxFontSize,
      maxLines,
      step,
      baseLineHeight,
      measureScrollHeight
    );

    assert.strictEqual(optimalSize, maxFontSize);
  });

  test("reduces font size until text fits", () => {
    // We want the text to fit when size is 18, but not at 19, 20, 21, 22.
    // For size 18, max height is 18 * 1.5 * 2 = 54
    // For size 19, max height is 19 * 1.5 * 2 = 57
    const measureScrollHeight = (testSize: number) => {
      if (testSize <= 18) {
        return testSize * 1.5 * maxLines - 2; // Fits
      }
      return testSize * 1.5 * maxLines + 10; // Overflows
    };

    const optimalSize = calculateOptimalFontSize(
      minFontSize,
      maxFontSize,
      maxLines,
      step,
      baseLineHeight,
      measureScrollHeight
    );

    assert.strictEqual(optimalSize, 18);
  });

  test("falls back to minFontSize if it never fits", () => {
    // Even at minFontSize (12), max height is 12 * 1.5 * 2 = 36
    // If we always return a massive scrollHeight, it should never fit.
    const measureScrollHeight = () => 1000;

    const optimalSize = calculateOptimalFontSize(
      minFontSize,
      maxFontSize,
      maxLines,
      step,
      baseLineHeight,
      measureScrollHeight
    );

    assert.strictEqual(optimalSize, minFontSize);
  });

  test("respects the step value during binary search", () => {
    const minSize = 10;
    const maxSize = 30;
    const customStep = 5;
    const currentBaseLineHeight = 45; // 30 * 1.5
    // Sizes to test: 10, 15, 20, 25, 30
    // We want it to fit at 20, but not at 25.

    const measureScrollHeight = (testSize: number) => {
      if (testSize <= 20) {
        return testSize * 1.5 * 2 - 1; // Fits
      }
      return testSize * 1.5 * 2 + 50; // Overflows
    };

    const optimalSize = calculateOptimalFontSize(
      minSize,
      maxSize,
      maxLines,
      customStep,
      currentBaseLineHeight,
      measureScrollHeight
    );

    // Because of step 5, valid sizes are 10, 15, 20, 25, 30.
    assert.strictEqual(optimalSize, 20);
  });

  test("handles final verification pass adjusting down", () => {
    // Simulating a scenario where the binary search might settle on a size,
    // but the final check inside the algorithm evaluates `scrollHeight > finalMaxHeight`
    // and steps down one more step.

    // Size 16 is max where it fits during binary search loop:
    // Actually wait, let's just make measureScrollHeight return different values based on calls,
    // or just simulate the edge case by ensuring scrollHeight > maxHeight *only* when the loop ends.
    let callCount = 0;
    const measureScrollHeight = (testSize: number) => {
      callCount++;
      // During binary search loop (first several calls), tell it that size 16 fits.
      // But on the last check (final verification pass), it overflows.
      if (testSize === 16 && callCount > 4) {
        return 16 * 1.5 * 2 + 10; // Overflows on the final check
      } else if (testSize <= 16) {
        return testSize * 1.5 * 2 - 2; // Fits
      }
      return testSize * 1.5 * 2 + 10; // Overflows for > 16
    };

    const optimalSize = calculateOptimalFontSize(
      minFontSize,
      maxFontSize,
      maxLines,
      step,
      baseLineHeight,
      measureScrollHeight
    );

    // Because size 16 failed the final verification pass, it should drop to 15.
    assert.strictEqual(optimalSize, 15);
  });
});
