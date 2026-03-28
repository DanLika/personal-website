import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getAllBlogs, blogsData } from "./blogs.ts";

describe("getAllBlogs", () => {
  test("should return an array of blogs", () => {
    const blogs = getAllBlogs();
    assert.ok(Array.isArray(blogs));
    assert.strictEqual(blogs.length, blogsData.length);
  });

  test("should sort blogs by date in descending order (newest first)", () => {
    const blogs = getAllBlogs();

    // Ensure that for every pair of consecutive blogs, the first one is newer or equal to the second one.
    for (let i = 0; i < blogs.length - 1; i++) {
      const currentBlogDate = new Date(blogs[i].date).getTime();
      const nextBlogDate = new Date(blogs[i + 1].date).getTime();

      assert.ok(
        currentBlogDate >= nextBlogDate,
        `Blog at index ${i} (${blogs[i].date}) should be newer than or equal to blog at index ${i + 1} (${blogs[i + 1].date})`
      );
    }
  });

  test("should not modify the original blogsData array", () => {
    // Create a copy of the original dates to compare against later
    const originalDates = blogsData.map(blog => blog.date);

    // Call the function
    getAllBlogs();

    // Check that the original array is untouched
    for (let i = 0; i < blogsData.length; i++) {
      assert.strictEqual(
        blogsData[i].date,
        originalDates[i],
        "The original blogsData array should not be modified"
      );
    }
  });
});
