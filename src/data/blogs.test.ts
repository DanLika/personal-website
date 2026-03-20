import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextBlog, getAllBlogs } from "./blogs.ts";

describe("getNextBlog", () => {
  test("returns the next blog when a valid slug is provided", () => {
    const blogs = getAllBlogs();
    const firstBlog = blogs[0];
    const secondBlog = blogs[1];

    const result = getNextBlog(firstBlog.slug);
    assert.deepStrictEqual(result, secondBlog);
  });

  test("loops back to the first blog when the last slug is provided", () => {
    const blogs = getAllBlogs();
    const lastBlog = blogs[blogs.length - 1];
    const firstBlog = blogs[0];

    const result = getNextBlog(lastBlog.slug);
    assert.deepStrictEqual(result, firstBlog);
  });

  test("returns the first blog when an invalid slug is provided", () => {
    const blogs = getAllBlogs();
    const firstBlog = blogs[0];

    const result = getNextBlog("non-existent-slug");
    assert.deepStrictEqual(result, firstBlog);
  });
});
