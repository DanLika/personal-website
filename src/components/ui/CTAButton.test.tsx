import { describe, it } from "node:test";
import * as assert from "node:assert";
import "global-jsdom/register";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { CTAButton } from "./CTAButton.tsx";

// Ensure React is globally available for TSX compilation outside of browser environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).React = React;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

import { afterEach } from "node:test";

describe("CTAButton", () => {
  // Cleanup after each test to avoid DOM pollution
  afterEach(cleanup);

  it("renders correctly with children", () => {
    render(<CTAButton>Click Me</CTAButton>);
    const button = screen.getByRole("button", { name: /click me/i });
    assert.ok(button);
  });

  it("handles onClick events", () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(<CTAButton onClick={handleClick}>Click Me</CTAButton>);
    const button = screen.getByRole("button", { name: /click me/i });

    fireEvent.click(button);
    assert.strictEqual(clicked, true);
  });

  it("handles disabled state correctly", () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <CTAButton disabled={true} onClick={handleClick}>
        Disabled Button
      </CTAButton>
    );

    const button = screen.getByRole("button", { name: /disabled button/i });

    assert.strictEqual(button.hasAttribute("disabled"), true);

    fireEvent.click(button);
    assert.strictEqual(clicked, false);
  });
});
