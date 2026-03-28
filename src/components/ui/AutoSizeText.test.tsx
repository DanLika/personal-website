import 'global-jsdom/register';
import { test, describe, afterEach, mock } from 'node:test';
import * as assert from 'node:assert';
import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { AutoSizeText } from './AutoSizeText.tsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

describe('AutoSizeText', () => {
  afterEach(() => {
    cleanup();
    mock.restoreAll();
  });

  test('calculates correct font size within bounds', async () => {
    const originalRaf = globalThis.requestAnimationFrame;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rafCallback: any = null;
    globalThis.requestAnimationFrame = (cb) => {
      rafCallback = cb;
      return 1;
    };

    const originalCaf = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = () => {};

    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ResizeObserver = MockResizeObserver as any;

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { lineHeight: '24px' } as any;
    };

    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        const fontSize = parseFloat(this.style.fontSize) || 22;
        const currentLineHeight = fontSize * (24 / 22);
        const maxHeight = currentLineHeight * 2;

        // Simulating that text only fits if fontSize <= 16
        if (fontSize <= 16) {
            return maxHeight - 1; // Fit
        } else {
            return maxHeight + 1; // Does not fit
        }
      }
    });

    const { container } = render(
      <AutoSizeText minFontSize={12} maxFontSize={22} maxLines={2} step={1}>
        Test content that requires resizing
      </AutoSizeText>
    );

    // Call RAF callback synchronously
    act(() => {
        if (rafCallback) rafCallback(0);
    });

    const span = container.querySelector('span');
    assert.ok(span);

    // Check if the optimal font size was applied
    assert.strictEqual(span.style.fontSize, '16px');

    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
    window.getComputedStyle = originalGetComputedStyle;
    if (originalScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).scrollHeight;
    }
  });

  test('applies minFontSize when space is very constrained', async () => {
    const originalRaf = globalThis.requestAnimationFrame;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rafCallback: any = null;
    globalThis.requestAnimationFrame = (cb) => {
      rafCallback = cb;
      return 1;
    };

    const originalCaf = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = () => {};

    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ResizeObserver = MockResizeObserver as any;

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { lineHeight: '24px' } as any;
    };

    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        const fontSize = parseFloat(this.style.fontSize) || 22;
        const currentLineHeight = fontSize * (24 / 22);
        const maxHeight = currentLineHeight * 2;

        // Simulating that text NEVER fits completely
        return maxHeight + 10;
      }
    });

    const { container } = render(
      <AutoSizeText minFontSize={10} maxFontSize={20} maxLines={2} step={1}>
        Very long text that does not fit at any size above min
      </AutoSizeText>
    );

    // Call RAF callback synchronously
    act(() => {
        if (rafCallback) rafCallback(0);
    });

    const span = container.querySelector('span');
    assert.ok(span);

    // Check if the minimal font size was applied
    assert.strictEqual(span.style.fontSize, '10px');

    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
    window.getComputedStyle = originalGetComputedStyle;
    if (originalScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).scrollHeight;
    }
  });

  test('applies maxFontSize when space is ample', async () => {
    const originalRaf = globalThis.requestAnimationFrame;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rafCallback: any = null;
    globalThis.requestAnimationFrame = (cb) => {
      rafCallback = cb;
      return 1;
    };

    const originalCaf = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = () => {};

    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ResizeObserver = MockResizeObserver as any;

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { lineHeight: '24px' } as any;
    };

    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        const fontSize = parseFloat(this.style.fontSize) || 22;
        const currentLineHeight = fontSize * (24 / 22);
        const maxHeight = currentLineHeight * 2;

        // Simulating that text ALWAYS fits completely
        return maxHeight - 10;
      }
    });

    const { container } = render(
      <AutoSizeText minFontSize={12} maxFontSize={22} maxLines={2} step={1}>
        Short text
      </AutoSizeText>
    );

    // Call RAF callback synchronously
    act(() => {
        if (rafCallback) rafCallback(0);
    });

    const span = container.querySelector('span');
    assert.ok(span);

    // Check if the maximal font size was applied
    assert.strictEqual(span.style.fontSize, '22px');

    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
    window.getComputedStyle = originalGetComputedStyle;
    if (originalScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).scrollHeight;
    }
  });

  test('cleans up RAF and observer on unmount', async () => {
    let cancelRafCalled = false;
    let disconnectCalled = false;

    const originalRaf = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = () => {
      return 1;
    };

    const originalCaf = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = () => {
        cancelRafCalled = true;
    };

    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {
          disconnectCalled = true;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ResizeObserver = MockResizeObserver as any;

    const { unmount } = render(
      <AutoSizeText>
        Test
      </AutoSizeText>
    );

    unmount();

    assert.strictEqual(cancelRafCalled, true, 'cancelAnimationFrame was not called');
    assert.strictEqual(disconnectCalled, true, 'disconnect was not called');

    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
  });
});
