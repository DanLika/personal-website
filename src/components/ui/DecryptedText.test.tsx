import "global-jsdom/register";
import * as assert from "node:assert";
import { test, describe, beforeEach, afterEach } from "node:test";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { DecryptedText } from "./DecryptedText.tsx";

// Mock global React to avoid "React is not defined" error in tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

// Expose window.navigator for JSDOM compatibility
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

// Polyfill IntersectionObserver for tests
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(_element: Element) {
    // Immediately trigger as intersecting for test purposes
    this.callback([{ isIntersecting: true }] as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }

  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = MockIntersectionObserver;

describe("DecryptedText", () => {
  let originalRAF: typeof requestAnimationFrame;
  let originalCAF: typeof cancelAnimationFrame;
  let rafCallbacks: FrameRequestCallback[] = [];

  beforeEach(() => {
    // Set up mock RAF to synchronously execute frames
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;

    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    globalThis.cancelAnimationFrame = (_id: number) => {
      // no-op for simplicity in these tests
    };
  });

  afterEach(() => {
    // Restore original RAF
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    rafCallbacks = [];
  });

  const runAllFrames = (timeToAdvance = 16) => {
    let currentTime = 0;
    while (rafCallbacks.length > 0) {
      const callbacksToRun = [...rafCallbacks];
      rafCallbacks = [];
      currentTime += timeToAdvance;
      for (const cb of callbacksToRun) {
        cb(currentTime);
      }
    }
  };

  test("renders text immediately when animateOn='view' and is intersecting", () => {
    render(<DecryptedText text="Hello World" animateOn="view" speed={0} />);

    // Check initial state, since speed is 0 and it's intersecting, we'll advance frames
    act(() => {
      runAllFrames(16);
    });

    // Should eventually fully reveal the text
    const textElements = screen.getAllByText((_content, element) => {
      return element?.textContent === "Hello World" && !element?.hasAttribute('style');
    });

    assert.ok(textElements.length > 0, "Text should fully reveal");
    assert.strictEqual(textElements[0].textContent, "Hello World");
  });

  test("does not animate if not hovered when animateOn='hover'", () => {
    render(<DecryptedText text="Secret text" animateOn="hover" />);

    // Run frames - shouldn't animate anything since it's not hovered
    act(() => {
      runAllFrames();
    });

    // We should be able to find a screen reader only span containing the text
    const srSpan = screen.getAllByText("Secret text").find(
      el => el.getAttribute('style')?.includes('clip: rect')
    );
    assert.ok(srSpan);
  });

  test("animates on hover and shows final text", () => {
    const { container } = render(<DecryptedText text="Hover Me" animateOn="hover" speed={0} />);

    const motionSpan = container.firstChild as HTMLElement;

    act(() => {
      motionSpan.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    });

    act(() => {
      runAllFrames(50);
    });

    // The text should be revealed eventually
    const hiddenSpans = container.querySelectorAll("span[aria-hidden='true'] > span");
    let combinedText = "";
    hiddenSpans.forEach(span => {
      combinedText += span.textContent;
    });

    assert.strictEqual(combinedText, "Hover Me");
  });

  test("handles different reveal directions without crashing", () => {
    const { container: centerContainer } = render(
      <DecryptedText text="Center Reveal" animateOn="view" revealDirection="center" speed={0} />
    );

    act(() => runAllFrames(50));

    const { container: endContainer } = render(
      <DecryptedText text="End Reveal" animateOn="view" revealDirection="end" speed={0} />
    );

    act(() => runAllFrames(50));

    // Ensure no crashes and they finished rendering
    assert.ok(centerContainer.textContent?.includes("Center Reveal"));
    assert.ok(endContainer.textContent?.includes("End Reveal"));
  });

  test("uses custom characters for encryption", () => {
    const { container } = render(
      <DecryptedText
        text="A"
        animateOn="view"
        characters="X"
        speed={100} // Slow down so it takes multiple frames
      />
    );

    // Wait for the first frame where it scrambles
    act(() => {
      if (rafCallbacks.length > 0) {
        const cb = rafCallbacks.shift()!;
        cb(0);
      }
    });

    // During scramble, it should only use "X"
    const visibleChars = container.querySelectorAll("span[aria-hidden='true'] > span");
    const char = visibleChars[0].textContent;

    // Either it's revealed 'A' or scrambled 'X'
    assert.ok(char === "A" || char === "X", `Character was ${char}, expected A or X`);
  });
});
