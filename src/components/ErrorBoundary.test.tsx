import "global-jsdom/register";
import * as assert from "node:assert";
import { test, describe, beforeEach, afterEach } from "node:test";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { MemoryRouter } from "react-router-dom";

// Polyfill React globally for testing with node:test & tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

describe("ErrorBoundary", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorOriginal: any;

  beforeEach(() => {
    // Mock console.error to avoid test output noise from React's intentional error logging
    consoleErrorOriginal = console.error;
    console.error = () => {}; // suppress
  });

  afterEach(() => {
    // Restore console.error
    console.error = consoleErrorOriginal;
    cleanup();
  });

  test("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-element">Normal Content</div>
      </ErrorBoundary>
    );

    const child = screen.getByTestId("child-element");
    assert.strictEqual(child.textContent, "Normal Content");
  });

  test("renders fallback UI when an error is thrown in a child component", () => {
    const ThrowError = () => {
      throw new Error("Test error!");
    };

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </MemoryRouter>
    );

    // Verify fallback UI is rendered
    const fallbackHeading = screen.getByText("Something went wrong");
    assert.ok(fallbackHeading !== null);

    const fallbackDescription = screen.getByText(
      "An unexpected error occurred. Please try refreshing the page."
    );
    assert.ok(fallbackDescription !== null);

    const refreshButton = screen.getByText("Refresh Page");
    assert.ok(refreshButton !== null);

    const goHomeLink = screen.getByText("Go Home");
    assert.ok(goHomeLink !== null);
  });
});
