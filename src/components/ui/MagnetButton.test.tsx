import { describe, it, beforeEach, afterEach } from "node:test";
import * as assert from "node:assert";
import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import "global-jsdom/register";
import { MagnetButton } from "./MagnetButton.tsx";

// Polyfill globalThis.React to fix React test render error in tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).React = React;

describe("MagnetButton Component", () => {
  let originalRAF: typeof requestAnimationFrame;
  let originalCAF: typeof cancelAnimationFrame;
  let rafs: FrameRequestCallback[] = [];

  const runRafs = () => {
    const currentRafs = rafs;
    rafs = [];
    currentRafs.forEach(cb => cb && cb(performance.now()));
  };

  beforeEach(() => {
    originalRAF = global.requestAnimationFrame;
    originalCAF = global.cancelAnimationFrame;

    rafs = [];
    global.requestAnimationFrame = (callback) => {
      rafs.push(callback);
      return rafs.length;
    };

    global.cancelAnimationFrame = (id) => {
      rafs[id - 1] = () => {}; // No-op instead of null to avoid typing issues or crash
    };
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
    cleanup();
  });

  it("should render correctly with children", () => {
    const { getByText } = render(
      <MagnetButton>Test Button</MagnetButton>
    );
    assert.ok(getByText("Test Button"));
  });

  it("should not react to mouse events when disabled", async () => {
    const origGBCR = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () => {
      return { left: 100, top: 100, width: 100, height: 50, right: 200, bottom: 150, x: 100, y: 100, toJSON: () => {} };
    };

    const { container } = render(
      <MagnetButton disabled>Test Button</MagnetButton>
    );

    const wrapper = container.firstChild as HTMLElement;
    const innerWrapper = wrapper.firstChild as HTMLElement;

    await act(async () => {
      runRafs();
    });

    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 125, bubbles: true }));
      runRafs();
    });

    // Position should be 0 since it's disabled
    assert.match(innerWrapper.style.transform || "", /translate3d\(0px, 0px, 0(px)?\)/);

    HTMLElement.prototype.getBoundingClientRect = origGBCR;
  });

  it("should calculate position on mouseenter within proximity", async () => {
    const origGBCR = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () => {
      return { left: 100, top: 100, width: 100, height: 50, right: 200, bottom: 150, x: 100, y: 100, toJSON: () => {} };
    };

    const { container } = render(
      <MagnetButton magnetStrength={2} padding={50}>Test Button</MagnetButton>
    );

    const wrapper = container.firstChild as HTMLElement;
    const innerWrapper = wrapper.firstChild as HTMLElement;

    // Initial mount RAFs
    await act(async () => {
      runRafs();
    });

    // Enter proximity (this makes isActive=true)
    await act(async () => {
      // clientX = 150, clientY = 125 is the exact center.
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 125, bubbles: true }));
      runRafs();
    });

    // Move within proximity (this calculates transform)
    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 160, clientY: 130, bubbles: true }));
      runRafs();
    });

    // centerX = 150, centerY = 125
    // mouseX = 160, mouseY = 130
    // offsetX = (160 - 150) / 2 = 5
    // offsetY = (130 - 125) / 2 = 2.5
    assert.match(innerWrapper.style.transform || "", /translate3d\(5px, 2.5px, 0(px)?\)/);

    HTMLElement.prototype.getBoundingClientRect = origGBCR;
  });

  it("should reset position when mouse leaves proximity", async () => {
    const origGBCR = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () => {
      return { left: 100, top: 100, width: 100, height: 50, right: 200, bottom: 150, x: 100, y: 100, toJSON: () => {} };
    };

    const { container } = render(
      <MagnetButton magnetStrength={2} padding={50}>Test Button</MagnetButton>
    );

    const wrapper = container.firstChild as HTMLElement;
    const innerWrapper = wrapper.firstChild as HTMLElement;

    // Initial mount RAFs
    await act(async () => {
      runRafs();
    });

    // Enter proximity
    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 160, clientY: 130, bubbles: true }));
      runRafs();
    });

    // Move within proximity
    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 160, clientY: 130, bubbles: true }));
      runRafs();
    });

    // Check it's moved
    assert.match(innerWrapper.style.transform || "", /translate3d\(5px, 2.5px, 0(px)?\)/);

    // Leave proximity (center is 150,125, width=100+padding=50 -> 100 distance allowed)
    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500, bubbles: true }));
      runRafs();
    });

    assert.match(innerWrapper.style.transform || "", /translate3d\(0px, 0px, 0(px)?\)/);

    HTMLElement.prototype.getBoundingClientRect = origGBCR;
  });
});
