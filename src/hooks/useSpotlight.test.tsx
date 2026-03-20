import 'global-jsdom/register';
import * as assert from 'node:assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { renderHook, act } from '@testing-library/react';
import { useSpotlight } from './useSpotlight.ts';

// Add navigator to globalThis since jsdom only provides a getter
Object.defineProperty(globalThis, 'navigator', {
  value: window.navigator,
  configurable: true,
});

describe('useSpotlight hook', () => {
  beforeEach(() => {
    // Mock RAF
    global.requestAnimationFrame = (callback: FrameRequestCallback) => {
      // Simulate synchronous execution for testing
      callback(0);
      return 1;
    };
    global.cancelAnimationFrame = () => {};

    // Mock getBoundingClientRect
    global.Element.prototype.getBoundingClientRect = () => ({
      width: 100,
      height: 100,
      top: 10,
      left: 10,
      bottom: 110,
      right: 110,
      x: 10,
      y: 10,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    // Clean up mocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.requestAnimationFrame = undefined as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.cancelAnimationFrame = undefined as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.Element.prototype.getBoundingClientRect = undefined as any;
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useSpotlight());

    assert.ok(result.current.handleMouseMove);
    assert.ok(result.current.handleTouchMove);
    assert.ok(result.current.cleanup);
  });

  it('should update element styles on handleMouseMove', () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement('div');
    const mockEvent = {
      currentTarget: target,
      clientX: 50,
      clientY: 50,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    // clientX (50) - rect.left (10) = 40
    // clientY (50) - rect.top (10) = 40
    assert.strictEqual(target.style.getPropertyValue('--mouse-x'), '40px');
    assert.strictEqual(target.style.getPropertyValue('--mouse-y'), '40px');
  });

  it('should update element styles on handleTouchMove', () => {
    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement('div');
    const mockEvent = {
      currentTarget: target,
      touches: [{ clientX: 60, clientY: 70 }],
    } as unknown as React.TouchEvent<HTMLElement>;

    act(() => {
      result.current.handleTouchMove(mockEvent);
    });

    // clientX (60) - rect.left (10) = 50
    // clientY (70) - rect.top (10) = 60
    assert.strictEqual(target.style.getPropertyValue('--mouse-x'), '50px');
    assert.strictEqual(target.style.getPropertyValue('--mouse-y'), '60px');
  });

  it('should update parent glow div when updateParent is true', () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: true }));

    const parent = document.createElement('div');
    const glowDiv = document.createElement('div');
    const target = document.createElement('div');

    parent.appendChild(glowDiv);
    parent.appendChild(target);

    const mockEvent = {
      currentTarget: target,
      clientX: 80,
      clientY: 90,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    // clientX (80) - rect.left (10) = 70
    // clientY (90) - rect.top (10) = 80
    assert.strictEqual(glowDiv.style.getPropertyValue('--mouse-x'), '70px');
    assert.strictEqual(glowDiv.style.getPropertyValue('--mouse-y'), '80px');
  });

  it('should NOT update parent glow div when updateParent is false', () => {
    const { result } = renderHook(() => useSpotlight({ updateParent: false }));

    const parent = document.createElement('div');
    const glowDiv = document.createElement('div');
    const target = document.createElement('div');

    parent.appendChild(glowDiv);
    parent.appendChild(target);

    const mockEvent = {
      currentTarget: target,
      clientX: 80,
      clientY: 90,
    } as unknown as React.MouseEvent<HTMLElement>;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    assert.strictEqual(glowDiv.style.getPropertyValue('--mouse-x'), '');
    assert.strictEqual(glowDiv.style.getPropertyValue('--mouse-y'), '');
  });

  it('should call cancelAnimationFrame on cleanup', () => {
    let cancelCalledWith: number | undefined;
    global.requestAnimationFrame = () => 123;
    global.cancelAnimationFrame = (id: number) => {
      cancelCalledWith = id;
    };

    const { result } = renderHook(() => useSpotlight());

    const target = document.createElement('div');
    const mockEvent = {
      currentTarget: target,
      clientX: 50,
      clientY: 50,
    } as unknown as React.MouseEvent<HTMLElement>;

    // Trigger RAF
    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    // Clean up
    act(() => {
      result.current.cleanup();
    });

    assert.strictEqual(cancelCalledWith, 123);
  });
});
