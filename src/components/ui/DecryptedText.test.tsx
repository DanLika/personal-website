import { test, describe, afterEach, beforeEach, mock } from "node:test";
import * as assert from "node:assert";
import * as React from "react";
import { render, cleanup, act } from "@testing-library/react";
import "global-jsdom/register";
import { DecryptedText } from "./DecryptedText.tsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

describe("DecryptedText", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders initial text correctly", () => {
    const { container } = render(<DecryptedText text="Test Text" animateOn="hover" />);
    // Check if sr-only text is rendered
    const srOnlySpan = container.querySelector('span[style*="clip: rect(0px, 0px, 0px, 0px)"]');
    assert.ok(srOnlySpan !== null);
    assert.strictEqual(srOnlySpan?.textContent, "Test Text");

    // Test the characters are rendered individually
    const ariaHiddenSpan = container.querySelector('span[aria-hidden="true"]');
    assert.ok(ariaHiddenSpan !== null);
    assert.strictEqual(ariaHiddenSpan?.children.length, 9); // "Test Text" length
  });
});

describe("DecryptedText behavior tests", () => {
  let originalRaf: typeof requestAnimationFrame;
  let originalCancelRaf: typeof cancelAnimationFrame;

  beforeEach(() => {

    originalRaf = global.requestAnimationFrame;
    originalCancelRaf = global.cancelAnimationFrame;

    global.requestAnimationFrame = (callback: FrameRequestCallback) => {
        // execute sync
        callback(performance.now());
        return 1;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    global.cancelAnimationFrame = (_id: number) => {};

    // Mock IntersectionObserver
    class MockIntersectionObserver {
      observe = mock.fn();
      unobserve = mock.fn();
      disconnect = mock.fn();
      constructor(callback: IntersectionObserverCallback) {
        // use callback for erasable syntax only
        callback([], this as unknown as IntersectionObserver);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  afterEach(() => {
    cleanup();
    global.requestAnimationFrame = originalRaf;
    global.cancelAnimationFrame = originalCancelRaf;
    mock.timers.reset();
  });

  test("animates on hover with useOriginalCharsOnly", () => {
    const { container } = render(
      <DecryptedText
        text="Test Text"
        animateOn="hover"
        useOriginalCharsOnly={true}
        speed={0}
        maxIterations={1}
        sequential={true}
      />
    );

    const motionSpan = container.querySelector('span[style*="display: inline-block"]');
    assert.ok(motionSpan !== null);

    act(() => {
        motionSpan?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    const srOnlySpan = container.querySelector('span[style*="clip: rect(0px, 0px, 0px, 0px)"]');
    assert.strictEqual(srOnlySpan?.textContent, "Test Text");

    // The aria-hidden part shouldn't crash
    const ariaHiddenSpan = container.querySelector('span[aria-hidden="true"]');
    assert.ok(ariaHiddenSpan !== null);
  });

  test("animates with custom characters", () => {
    const { container } = render(
      <DecryptedText
        text="Hello"
        animateOn="hover"
        characters="XYZ"
        speed={0}
      />
    );

    const motionSpan = container.querySelector('span[style*="display: inline-block"]');
    assert.ok(motionSpan !== null);

    act(() => {
        motionSpan?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
  });

  test("animates on view via IntersectionObserver", () => {
    let observerCallback: IntersectionObserverCallback | null = null;

    class MockObserver {
      observe = mock.fn();
      unobserve = mock.fn();
      disconnect = mock.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.IntersectionObserver = MockObserver as any;

    const { container } = render(
      <DecryptedText
        text="View Test"
        animateOn="view"
      />
    );

    assert.ok(observerCallback !== null);

    // Trigger intersection
    act(() => {
      if (observerCallback) {
        observerCallback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);
      }
    });

    const srOnlySpan = container.querySelector('span[style*="clip: rect(0px, 0px, 0px, 0px)"]');
    assert.strictEqual(srOnlySpan?.textContent, "View Test");
  });

  test("animates non-sequentially", () => {
      const { container } = render(
        <DecryptedText
          text="Shuffle"
          animateOn="hover"
          sequential={false}
          maxIterations={5}
          speed={0}
        />
      );

      const motionSpan = container.querySelector('span[style*="display: inline-block"]');
      assert.ok(motionSpan !== null);

      act(() => {
          motionSpan?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });
  });

  test("reveals from end", () => {
    const { container } = render(
      <DecryptedText
        text="Direction"
        animateOn="hover"
        revealDirection="end"
        speed={0}
      />
    );

    const motionSpan = container.querySelector('span[style*="display: inline-block"]');
    assert.ok(motionSpan !== null);

    act(() => {
        motionSpan?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
  });

  test("reveals from center", () => {
    const { container } = render(
      <DecryptedText
        text="CenterTest"
        animateOn="hover"
        revealDirection="center"
        speed={0}
      />
    );

    const motionSpan = container.querySelector('span[style*="display: inline-block"]');
    assert.ok(motionSpan !== null);

    act(() => {
        motionSpan?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
  });
});
