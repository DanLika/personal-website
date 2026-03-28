import "global-jsdom/register";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as assert from "node:assert";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MagnetButton } from "./MagnetButton.tsx";

// Mock React and navigator for node test runner + global-jsdom
(globalThis as any).React = React;
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

describe("MagnetButton", () => {
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;
  let originalCancelAnimationFrame: typeof window.cancelAnimationFrame;

  beforeEach(() => {
    // Synchronous mock of requestAnimationFrame
    originalRequestAnimationFrame = window.requestAnimationFrame;
    originalCancelAnimationFrame = window.cancelAnimationFrame;

    // Immediately trigger the RAF callback to bypass React state batching and debouncing delays
    let id = 0;
    window.requestAnimationFrame = (callback) => {
      id++;
      const currentId = id;
      callback(performance.now());
      return currentId;
    };
    window.cancelAnimationFrame = () => {};

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = () => ({
      width: 100,
      height: 50,
      top: 100,
      left: 100,
      bottom: 150,
      right: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("renders children correctly", () => {
    const { container } = render(
      <MagnetButton>
        <span data-testid="test-child">Test Button</span>
      </MagnetButton>
    );
    const element = container.querySelector('[data-testid="test-child"]');
    assert.ok(element);
  });

  it("is not active when disabled", async () => {
    const { container } = render(
      <MagnetButton disabled>Test Button</MagnetButton>
    );

    const innerDiv = container.querySelector("div > div");
    assert.ok(innerDiv);

    const motionDiv = container.querySelector("div > div > div");
    assert.ok(motionDiv);

    // Initial transform should be 0,0
    await waitFor(() => {
        assert.match(motionDiv.getAttribute("style") || "", /translate3d\(0px, 0px, 0\)/);
    });

    // Simulate mouse move within bounds (centerX=150, centerY=125, within 100px padding)
    fireEvent.mouseMove(window, { clientX: 150, clientY: 125 });

    // Transform should still be 0,0 since it's disabled
    await waitFor(() => {
        assert.match(motionDiv.getAttribute("style") || "", /translate3d\(0px, 0px, 0\)/);
    });
  });

  it("activates on mouseenter if within padding distance and computes position appropriately", async () => {
    const { container } = render(
      <MagnetButton padding={100} magnetStrength={2}>Test Button</MagnetButton>
    );

    const innerDiv = container.querySelector("div > div");
    assert.ok(innerDiv);

    const motionDiv = container.querySelector("div > div > div");
    assert.ok(motionDiv);

    // Initial transform check
    await waitFor(() => {
        assert.match(motionDiv.getAttribute("style") || "", /translate3d\(0px, 0px, 0\)/);
    });

    // Use an exact setup. Since testing mouse move logic,
    // fireEvent.mouseMove on window is what triggers it.
    // Wait for the initial bounds calculation RAF to clear
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Then move to trigger mouseEnter handler activation
    fireEvent.mouseMove(window, { clientX: 150, clientY: 125 });

    // Wait until activation finishes
    await waitFor(() => {
       // activeTransition
       assert.match(motionDiv.getAttribute("style") || "", /transform 0.3s/);
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Now trigger the move
    // centerX: 150, centerY: 125
    // mouseX: 160, mouseY: 135
    // Distances: distX=10, distY=10. Well within width/2+100=150 and height/2+100=125.
    // Offset calculation: (160 - 150) / 2 = 5, (135 - 125) / 2 = 5
    fireEvent.mouseMove(window, { clientX: 160, clientY: 135 });

    // State update can be asynchronous due to React state batching and our RAF mock.
    await waitFor(() => {
      // Allow exact match or Framer Motion variants
      assert.match(motionDiv.getAttribute("style") || "", /translate3d\(5px, 5px, 0(px)?\)/);
    }, { timeout: 2000 });
  });

  it("resets position when mouse leaves the bounding box plus padding", async () => {
    const { container } = render(
      <MagnetButton padding={50} magnetStrength={2}>Test Button</MagnetButton>
    );

    const innerDiv = container.querySelector("div > div");
    assert.ok(innerDiv);

    const motionDiv = container.querySelector("div > div > div");
    assert.ok(motionDiv);

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Enter bounds
    fireEvent.mouseMove(window, { clientX: 150, clientY: 125 });

    // Wait until activation
    await waitFor(() => {
      assert.match(motionDiv.getAttribute("style") || "", /transform 0.3s/);
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Move slightly off center
    fireEvent.mouseMove(window, { clientX: 160, clientY: 135 });
    await waitFor(() => {
      assert.match(motionDiv.getAttribute("style") || "", /translate3d\(5px, 5px, 0(px)?\)/);
    }, { timeout: 2000 });

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Move outside the bounding box + padding
    // Padding 50: allowed distance from center X is 100, Y is 75
    // Moving to clientX: 300 (distX 150), clientY: 300 (distY 175)
    fireEvent.mouseMove(window, { clientX: 300, clientY: 300 });

    // Should reset position to 0,0 and go inactive
    await waitFor(() => {
      assert.match(motionDiv.getAttribute("style") || "", /translate3d\(0px, 0px, 0(px)?\)/);
      assert.match(motionDiv.getAttribute("style") || "", /transform 0.5s/);
    }, { timeout: 2000 });
  });
});
