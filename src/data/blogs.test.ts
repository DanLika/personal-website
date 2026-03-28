import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextBlog, getAllBlogs } from "./blogs.ts";

describe("getNextBlog", () => {
  test("returns the next blog post in the array", () => {
    const blogs = getAllBlogs();
    if (blogs.length < 2) return; // Need at least 2 blogs for this test

    // Pick the first blog
    const currentSlug = blogs[0].slug;
    const nextBlog = getNextBlog(currentSlug);

    // Should return the second blog
    assert.strictEqual(nextBlog?.slug, blogs[1].slug);
  });

  test("loops back to the first post when at the end of the array", () => {
    const blogs = getAllBlogs();
    if (blogs.length === 0) return;

    // Pick the last blog
    const currentSlug = blogs[blogs.length - 1].slug;
    const nextBlog = getNextBlog(currentSlug);

    // Should loop back to the first blog
    assert.strictEqual(nextBlog?.slug, blogs[0].slug);
  });

  test("returns the first post when slug is not found", () => {
    const blogs = getAllBlogs();
    if (blogs.length === 0) return;

    const currentSlug = "non-existent-slug-12345";
    const nextBlog = getNextBlog(currentSlug);

    // Should default to returning the first blog
    assert.strictEqual(nextBlog?.slug, blogs[0].slug);
  });
});
