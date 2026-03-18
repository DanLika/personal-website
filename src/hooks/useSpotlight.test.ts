import "global-jsdom/register";
import * as assert from "node:assert";
import { test, describe, beforeEach, afterEach, mock } from "node:test";
import { renderHook, cleanup as cleanupReact } from "@testing-library/react";
import { useSpotlight } from "./useSpotlight";

describe("useSpotlight", () => {
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let originalCancelAnimationFrame: typeof cancelAnimationFrame;

  beforeEach(() => {
    // Mock RAF
    originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

    globalThis.requestAnimationFrame = mock.fn((cb: FrameRequestCallback) => {
      // Execute synchronously for testing
      cb(performance.now());
      return 1;
    }) as unknown as typeof requestAnimationFrame;

    globalThis.cancelAnimationFrame = mock.fn() as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    cleanupReact();
    mock.restoreAll();
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  test("should update element CSS variables on mouse move", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const target = document.createElement("div");
    // Mock getBoundingClientRect
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

    const mockEvent = {
      currentTarget: target,
      clientX: 50,
      clientY: 60,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(mockEvent);

    assert.strictEqual(
      (globalThis.requestAnimationFrame as unknown as { mock: { calls: unknown[] } }).mock.calls.length,
      1
    );

    // x = clientX (50) - rect.left (10) = 40
    // y = clientY (60) - rect.top (20) = 40
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "40px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "40px");
  });

  test("should update element CSS variables on touch move", () => {
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

    const mockEvent = {
      currentTarget: target,
      touches: [{ clientX: 75, clientY: 85 }],
    } as unknown as React.TouchEvent<HTMLElement>;

    result.current.handleTouchMove(mockEvent);

    assert.strictEqual(
      (globalThis.requestAnimationFrame as unknown as { mock: { calls: unknown[] } }).mock.calls.length,
      1
    );

    // x = clientX (75) - rect.left (15) = 60
    // y = clientY (85) - rect.top (25) = 60
    assert.strictEqual(target.style.getPropertyValue("--mouse-x"), "60px");
    assert.strictEqual(target.style.getPropertyValue("--mouse-y"), "60px");
  });

  test("should update parent glow div when updateParent is true", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: true }));

    const parent = document.createElement("div");
    const glowDiv = document.createElement("div");
    glowDiv.className = "glow"; // For debugging if needed

    // The hook uses: parent.querySelector('div')
    // which returns the *first* div. We want that to be glowDiv.
    // If target is also a div and appended first, it might find target instead!
    // Let's append glowDiv first or make target a different element type like 'span'.
    const targetSpan = document.createElement("span");
    parent.appendChild(glowDiv);
    parent.appendChild(targetSpan);

    // Ensure we can traverse back
    Object.defineProperty(targetSpan, 'parentElement', {
      value: parent,
      configurable: true
    });

    targetSpan.getBoundingClientRect = () => ({
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

    const mockEvent = {
      currentTarget: targetSpan,
      clientX: 30,
      clientY: 40,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(mockEvent);

    assert.strictEqual(targetSpan.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(targetSpan.style.getPropertyValue("--mouse-y"), "40px");

    // Should also update the glow div
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-y"), "40px");
  });

  test("should not update parent glow div when updateParent is false", () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const parent = document.createElement("div");
    const targetSpan = document.createElement("span");
    const glowDiv = document.createElement("div");

    parent.appendChild(glowDiv);
    parent.appendChild(targetSpan);

    Object.defineProperty(targetSpan, 'parentElement', {
      value: parent,
      configurable: true
    });

    targetSpan.getBoundingClientRect = () => ({
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

    const mockEvent = {
      currentTarget: targetSpan,
      clientX: 30,
      clientY: 40,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(mockEvent);

    assert.strictEqual(targetSpan.style.getPropertyValue("--mouse-x"), "30px");
    assert.strictEqual(targetSpan.style.getPropertyValue("--mouse-y"), "40px");

    // Should NOT update the glow div
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-x"), "");
    assert.strictEqual(glowDiv.style.getPropertyValue("--mouse-y"), "");
  });

  test("should call cancelAnimationFrame on cleanup", () => {
    // We need to stop RAF from executing immediately to test cleanup
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    globalThis.requestAnimationFrame = mock.fn((_cb: FrameRequestCallback) => 123) as unknown as typeof requestAnimationFrame;

    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement("div");
    target.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => {},
    });

    const mockEvent = {
      currentTarget: target,
      clientX: 30,
      clientY: 40,
    } as unknown as React.MouseEvent<HTMLElement>;

    result.current.handleMouseMove(mockEvent);

    assert.strictEqual(
      (globalThis.requestAnimationFrame as unknown as { mock: { calls: unknown[] } }).mock.calls.length,
      1
    );

    // Now cleanup
    result.current.cleanup();

    assert.strictEqual(
      (globalThis.cancelAnimationFrame as unknown as { mock: { calls: { arguments: unknown[] }[] } }).mock.calls.length,
      1
    );
    assert.deepStrictEqual(
      (globalThis.cancelAnimationFrame as unknown as { mock: { calls: { arguments: unknown[] }[] } }).mock.calls[0].arguments,
      [123]
    );
  });
});
