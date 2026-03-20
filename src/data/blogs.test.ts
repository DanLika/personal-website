import test from "node:test";
import * as assert from "node:assert";
import { getBlogBySlug, blogsData } from "./blogs.ts";

test("getBlogBySlug", async (t) => {
  await t.test("should return the correct blog post for an existing slug", () => {
    // blogsData contains blog posts, we can use the first one's slug for testing
    const targetBlog = blogsData[0];
    const result = getBlogBySlug(targetBlog.slug);

    assert.deepStrictEqual(result, targetBlog);
  });

  await t.test("should return undefined for a non-existing slug", () => {
    const fakeSlug = "this-slug-does-not-exist-123456789";
    const result = getBlogBySlug(fakeSlug);

    assert.strictEqual(result, undefined);
  });
});
