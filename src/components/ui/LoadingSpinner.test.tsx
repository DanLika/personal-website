import * as assert from "node:assert";
import { test, describe } from "node:test";
import React from "react";
import { create } from "react-test-renderer";
import { LoadingSpinner } from "./LoadingSpinner.tsx";

// Required to resolve 'React is not defined' ReferenceErrors
// caused by the react-jsx transform in tsx testing.
(globalThis as any).React = React;

describe("LoadingSpinner", () => {
  test("renders spinner when isLoading is true", () => {
    const root = create(<LoadingSpinner isLoading={true} />);
    const tree = root.toJSON();

    // The rendered component should return a valid React element
    assert.ok(tree, "LoadingSpinner should render an element when isLoading is true");

    // Verify it contains a circle tag, matching the SVG structure inside LoadingSpinner
    const treeString = JSON.stringify(tree);
    assert.ok(treeString.includes('"type":"circle"'), "LoadingSpinner should render SVG circles");
  });

  test("does not render spinner when isLoading is false", () => {
    const root = create(<LoadingSpinner isLoading={false} />);
    const tree = root.toJSON();

    // AnimatePresence will typically keep the element around if it has an exit animation,
    // but without an initial render, or if handled immediately, it might be null.
    // Framer Motion's AnimatePresence might return empty or just a wrapper.
    // We should check that the actual spinner element is not present.
    // Since AnimatePresence is a bit tricky with react-test-renderer in Node.js,
    // let's ensure the main `div` with the background color isn't there,
    // or simply that the tree is null if Framer Motion correctly unmounts it immediately.

    // AnimatePresence rendering a falsy child returns null in a test environment
    // without an active DOM/animation frame cycle.
    assert.strictEqual(tree, null, "LoadingSpinner should render null when isLoading is false");
  });
});
