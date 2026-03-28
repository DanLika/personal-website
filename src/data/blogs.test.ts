import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextBlog, getAllBlogs } from "./blogs.ts";

describe("getNextBlog", () => {
  test("returns the next blog post when a valid slug is provided", () => {
    const blogs = getAllBlogs();
    if (blogs.length < 2) {
      // Skip if there are not enough blogs to test
      return;
    }
    const currentSlug = blogs[0].slug;
    const expectedNextSlug = blogs[1].slug;

    const nextBlog = getNextBlog(currentSlug);

    assert.ok(nextBlog, "Should return a blog post");
    assert.strictEqual(nextBlog.slug, expectedNextSlug, "Should return the correct next blog post");
  });

  test("loops back to the first post when given the last post's slug", () => {
    const blogs = getAllBlogs();
    if (blogs.length < 1) {
      return;
    }
    const lastSlug = blogs[blogs.length - 1].slug;
    const expectedNextSlug = blogs[0].slug;

    const nextBlog = getNextBlog(lastSlug);

    assert.ok(nextBlog, "Should return a blog post");
    assert.strictEqual(nextBlog.slug, expectedNextSlug, "Should loop back to the first post");
  });

  test("returns the first post when the slug is not found", () => {
    const blogs = getAllBlogs();
    if (blogs.length < 1) {
      return;
    }
    const invalidSlug = "this-slug-does-not-exist";
    const expectedNextSlug = blogs[0].slug;

    const nextBlog = getNextBlog(invalidSlug);

    assert.ok(nextBlog, "Should return a blog post");
    assert.strictEqual(nextBlog.slug, expectedNextSlug, "Should fall back to the first post");
  });
});
