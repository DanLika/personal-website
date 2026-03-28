import "global-jsdom/register";
import * as assert from "node:assert";
import { test, describe, beforeEach, afterEach, mock } from "node:test";
import { renderHook } from "@testing-library/react";
import { useSpotlight } from "./useSpotlight.ts";

// Expose navigator for React/JSDOM
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

describe("useSpotlight", () => {
  let originalRAF: typeof window.requestAnimationFrame;
  let originalCAF: typeof window.cancelAnimationFrame;
  let rafCallback: FrameRequestCallback | null = null;
  let rafIdCounter = 0;

  beforeEach(() => {
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;

    rafCallback = null;
    rafIdCounter = 0;

    // Mock RAF synchronously for testing
    globalThis.requestAnimationFrame = mock.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      rafIdCounter++;
      return rafIdCounter;
    });

    globalThis.cancelAnimationFrame = mock.fn((id: number) => {
      if (id === rafIdCounter) {
        rafCallback = null;
      }
    });
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    mock.restoreAll();
  });

  const triggerRAF = () => {
    if (rafCallback) {
      const cb = rafCallback;
      rafCallback = null;
      cb(performance.now());
    }
  };

  test("should setup cleanup correctly", () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");
    const event = {
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent<HTMLElement>;

    // Trigger mouse move to schedule RAF
    result.current.handleMouseMove(event);

    assert.strictEqual((globalThis.requestAnimationFrame as any).mock.callCount(), 1);

    // Call cleanup manually
    result.current.cleanup();

    assert.strictEqual((globalThis.cancelAnimationFrame as any).mock.callCount(), 1);
  });

  test("should update target element properties on handleMouseMove", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const target = document.createElement("div");
    target.getBoundingClientRect = () => ({
      left: 10,
      top: 20,
      right: 110,
      bottom: 120,
      width: 100,
      height: 100,
      x: 10,
      y: 20,
      toJSON: () => {},
    });

    const event = {
      currentTarget: target,
      clientX: 50,
      clientY: 60,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(event);

    // Simulate RAF execution
    triggerRAF();

    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "40px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "40px");
  });

  test("should update target element properties on handleTouchMove", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const target = document.createElement("div");
    target.getBoundingClientRect = () => ({
      left: 15,
      top: 25,
      right: 115,
      bottom: 125,
      width: 100,
      height: 100,
      x: 15,
      y: 25,
      toJSON: () => {},
    });

    const event = {
      currentTarget: target,
      touches: [{ clientX: 65, clientY: 75 }],
    } as unknown as React.TouchEvent<HTMLElement>;

    result.current.handleTouchMove(event);

    // Simulate RAF execution
    triggerRAF();

    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "50px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "50px");
  });

  test("should update parent element's inner div when updateParent is true", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: true }));

    const parent = document.createElement("div");
    const innerGlow = document.createElement("div");
    parent.appendChild(innerGlow);
    const target = document.createElement("div");
    parent.appendChild(target);

    target.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const event = {
      currentTarget: target,
      clientX: 30,
      clientY: 40,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(event);
    triggerRAF();

    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "40px");
    assert.strictEqual(innerGlow.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(innerGlow.style.getPropertyValue("--mouse-y"), "40px");
  });

  test("should not schedule multiple RAFs for consecutive events", () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");
    target.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const event1 = {
      currentTarget: target,
      clientX: 10,
      clientY: 10,
    } as unknown as React.MouseEvent<HTMLElement>;

    const event2 = {
      currentTarget: target,
      clientX: 20,
      clientY: 20,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(event1);
    result.current.handleMouseMove(event2);

    // RAF should only be scheduled once
    assert.strictEqual((globalThis.requestAnimationFrame as any).mock.callCount(), 1);

    triggerRAF();

    // The properties should reflect the last event (event2)
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "20px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "20px");
  });
});
