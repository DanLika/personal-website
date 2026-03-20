import "global-jsdom/register";
import * as assert from "node:assert";
import test, { describe, beforeEach, afterEach } from "node:test";
import React from "react";
import * as testingLibraryReact from "@testing-library/react";
const { render, screen, cleanup } = testingLibraryReact;
import { MemoryRouter } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary.tsx";

// Mock global React for TSX
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;

// JSDOM's window.navigator workaround
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

describe("ErrorBoundary", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Suppress console.error during tests
    originalConsoleError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    cleanup();
    console.error = originalConsoleError;
  });

  test("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-component">Normal Child</div>
      </ErrorBoundary>
    );

    const child = screen.getByTestId("child-component");
    assert.strictEqual(child.textContent, "Normal Child");
  });

  test("catches error and renders fallback UI", () => {
    const ProblemChild = () => {
      throw new Error("Test error!");
    };

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      </MemoryRouter>
    );

    // Verify fallback UI is rendered
    const heading = screen.getByRole("heading", { level: 1 });
    assert.strictEqual(heading.textContent, "Something went wrong");

    const message = screen.getByText("An unexpected error occurred. Please try refreshing the page.");
    assert.ok(message);

    // Verify Go Home link is present (via MemoryRouter)
    const homeLink = screen.getByRole("link", { name: "Go Home" });
    assert.strictEqual(homeLink.getAttribute("href"), "/");
  });
});
