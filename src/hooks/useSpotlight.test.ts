import { test, describe, beforeEach, afterEach } from "node:test";
import * as assert from "node:assert";
import "global-jsdom/register";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useSpotlight } from "./useSpotlight.ts";

// Fix for React in native node test runner
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

// JSDOM's window.navigator only has a getter
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

describe("useSpotlight", () => {
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let originalCancelAnimationFrame: typeof cancelAnimationFrame;
  let rafCallback: FrameRequestCallback | null = null;
  let nextRafId = 1;

  beforeEach(() => {
    // Mock RAF synchronously
    originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

    rafCallback = null;
    nextRafId = 1;

    globalThis.requestAnimationFrame = (callback) => {
      rafCallback = callback;
      return nextRafId++;
    };

    globalThis.cancelAnimationFrame = (id) => {
      if (id === nextRafId - 1) {
        rafCallback = null;
      }
    };
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  const triggerRaf = () => {
    if (rafCallback) {
      const cb = rafCallback;
      rafCallback = null; // Clear before calling, like real RAF
      cb(performance.now());
    }
  };

  test("handleMouseMove updates CSS variables on target", () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");

    // Mock getBoundingClientRect
    target.getBoundingClientRect = () => ({
      left: 10,
      top: 20,
      width: 100,
      height: 100,
      right: 110,
      bottom: 120,
      x: 10,
      y: 20,
      toJSON: () => {}
    });

    const mockEvent = {
      currentTarget: target,
      clientX: 50,
      clientY: 60,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    // Variables shouldn't be set before RAF
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "");

    // Trigger RAF to process the pending update
    act(() => {
      triggerRaf();
    });

    // clientX (50) - rect.left (10) = 40
    // clientY (60) - rect.top (20) = 40
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "40px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "40px");
  });

  test("handleTouchMove updates CSS variables on target", () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");

    target.getBoundingClientRect = () => ({
      left: 15,
      top: 25,
      width: 100,
      height: 100,
      right: 115,
      bottom: 125,
      x: 15,
      y: 25,
      toJSON: () => {}
    });

    const mockEvent = {
      currentTarget: target,
      touches: [{ clientX: 45, clientY: 55 }],
    } as unknown as React.TouchEvent<HTMLElement>;

    act(() => {
      result.current.handleTouchMove(mockEvent);
    });

    act(() => {
      triggerRaf();
    });

    // clientX (45) - rect.left (15) = 30
    // clientY (55) - rect.top (25) = 30
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "30px");
  });

  test("updates parent elements when updateParent is true", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: true }));

    const parent = document.createElement("section");
    const glowDiv = document.createElement("div");
    const target = document.createElement("article");

    parent.appendChild(glowDiv);
    parent.appendChild(target);

    target.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const mockEvent = {
      currentTarget: target,
      clientX: 25,
      clientY: 35,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
      triggerRaf();
    });

    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "25px");
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-x"), "25px");
  });

  test("does not update parent elements when updateParent is false", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const parent = document.createElement("section");
    const glowDiv = document.createElement("div");
    const target = document.createElement("article");

    parent.appendChild(glowDiv);
    parent.appendChild(target);

    target.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const mockEvent = {
      currentTarget: target,
      clientX: 25,
      clientY: 35,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
      triggerRaf();
    });

    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "25px");
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-x"), "");
  });

  test("cleanup cancels pending RAF", () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");
    target.getBoundingClientRect = () => ({
      left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => {}
    });

    const mockEvent = {
      currentTarget: target,
      clientX: 50,
      clientY: 50,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    assert.notStrictEqual(rafCallback, null);

    act(() => {
      result.current.cleanup();
    });

    // Or unmount() will also call it if we test useEffect cleanup directly
    assert.strictEqual(rafCallback, null);
  });
});
