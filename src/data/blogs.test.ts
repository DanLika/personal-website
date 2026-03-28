import { describe, it } from "node:test";
import * as assert from "node:assert";
import { getBlogBySlug, blogsData } from "./blogs.ts";

describe("getBlogBySlug", () => {
  it("should return the correct blog post when given a valid slug", () => {
    // We assume there's at least one blog post in blogsData based on real data
    const existingPost = blogsData[0];
    assert.ok(existingPost, "Expected at least one blog post in blogsData");

    const result = getBlogBySlug(existingPost.slug);

    assert.ok(result, "Expected to find a blog post");
    assert.strictEqual(result.slug, existingPost.slug);
    assert.strictEqual(result.id, existingPost.id);
  });

  it("should return undefined when given an invalid slug", () => {
    const invalidSlug = "this-slug-does-not-exist-" + Date.now();
    const result = getBlogBySlug(invalidSlug);

    assert.strictEqual(result, undefined);
  });

  it("should handle edge case of empty string slug", () => {
    const result = getBlogBySlug("");

    // Unless there's actually a blog post with an empty slug, this should be undefined
    const hasEmptySlug = blogsData.some(post => post.slug === "");
    if (hasEmptySlug) {
      assert.ok(result);
      assert.strictEqual(result.slug, "");
    } else {
      assert.strictEqual(result, undefined);
    }
  });
});
