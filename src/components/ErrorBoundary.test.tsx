import { test, describe, mock, afterEach } from "node:test";
import * as assert from "node:assert";
import React from "react";
(globalThis as any).React = React; // Important for TSX in Node

import TestRenderer from "react-test-renderer";
import { ErrorBoundary } from "./ErrorBoundary";
import { Link, MemoryRouter } from "react-router-dom";

describe("ErrorBoundary", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test("renders children when no error occurs", () => {
    const renderer = TestRenderer.create(
      <ErrorBoundary>
        <div>Test Child Content</div>
      </ErrorBoundary>
    );

    const root = renderer.root;
    assert.strictEqual(root.findByType("div").children[0], "Test Child Content");
  });

  test("catches error in child component and renders fallback UI", () => {
    const consoleSpy = mock.method(console, "error", () => {});

    const ProblemChild = () => {
      throw new Error("Simulated test error");
    };

    // We need to provide a mock for window.location for the button click
    const originalWindow = (globalThis as any).window;
    (globalThis as any).window = { location: { reload: mock.fn() } } as any;

    try {
      const renderer = TestRenderer.create(
        <MemoryRouter>
          <ErrorBoundary>
            <ProblemChild />
          </ErrorBoundary>
        </MemoryRouter>
      );

      const root = renderer.root;

      // Verify the fallback UI is rendered
      assert.strictEqual(root.findAllByType("h1")[0].children[0], "Something went wrong");

      // Verify console.error was called by componentDidCatch
      assert.ok(consoleSpy.mock.calls.length > 0);

      // React-test-renderer might log its own stack traces to console.error before the boundary logs.
      // We search through the calls to find the one made by our boundary.
      const boundaryCall = consoleSpy.mock.calls.find(call => call.arguments[0] === "Error caught by boundary:");
      assert.ok(boundaryCall, "Expected console.error to be called with 'Error caught by boundary:'");
      assert.strictEqual(boundaryCall.arguments[1].message, "Simulated test error");

      // Verify the reload button
      const button = root.findByType("button");
      button.props.onClick();
      assert.strictEqual(((globalThis as any).window.location.reload as any).mock.calls.length, 1);

      // Verify the Go Home link
      const link = root.findByType(Link);
      assert.strictEqual(link.props.to, "/");

    } finally {
      (globalThis as any).window = originalWindow;
    }
  });
});