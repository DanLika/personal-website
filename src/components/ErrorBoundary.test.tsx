import "global-jsdom/register";
import * as assert from "node:assert";
import { test, describe, mock, afterEach } from "node:test";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";

// Required to use JSX/React with tsx and node:test correctly
(globalThis as any).React = React;

const ThrowError = () => {
  throw new Error("Test error!");
};

describe("ErrorBoundary", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child Content</div>
      </ErrorBoundary>
    );

    const child = screen.getByTestId("child");
    assert.strictEqual(child.textContent, "Child Content");
  });

  test("renders fallback UI and catches error when child throws", () => {
    // Mock console.error to prevent expected error from polluting test output
    const consoleErrorMock = mock.method(console, "error", () => {});

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>
    );

    // Verify fallback UI is shown
    const heading = screen.getByText("Something went wrong");
    assert.ok(heading);

    const description = screen.getByText("An unexpected error occurred. Please try refreshing the page.");
    assert.ok(description);

    // Verify component did catch logged the error
    assert.ok(consoleErrorMock.mock.callCount() >= 1);

    // Find the call that comes from our boundary
    const boundaryCall = consoleErrorMock.mock.calls.find(
      (call) => call.arguments[0] === "Error caught by boundary:"
    );
    assert.ok(boundaryCall);
    const errorArg = boundaryCall.arguments[1];
    assert.strictEqual(errorArg instanceof Error, true);
    assert.strictEqual(errorArg.message, "Test error!");
  });
});
