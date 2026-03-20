import { describe, it } from "node:test";
import * as assert from "node:assert";
import { getAllBlogs, blogsData } from "./blogs.ts";

describe("getAllBlogs", () => {
  it("should return all blog posts", () => {
    const result = getAllBlogs();
    assert.strictEqual(result.length, blogsData.length, "Should return all blogs");
  });

  it("should sort blog posts by date in descending order (newest first)", () => {
    const result = getAllBlogs();

    // Check if it's sorted
    for (let i = 0; i < result.length - 1; i++) {
      const currentDate = new Date(result[i].date).getTime();
      const nextDate = new Date(result[i + 1].date).getTime();
      assert.ok(currentDate >= nextDate, `Blog at index ${i} should be newer or equal to blog at index ${i + 1}`);
    }
  });

  it("should not mutate the original blogsData array", () => {
    // Create a copy to compare against
    const originalBlogsData = [...blogsData];

    getAllBlogs();

    // Verify length hasn't changed
    assert.strictEqual(blogsData.length, originalBlogsData.length, "Original array length should not change");

    // Verify items are in the exact same order
    for (let i = 0; i < blogsData.length; i++) {
      assert.strictEqual(blogsData[i].id, originalBlogsData[i].id, "Original array order should not change");
    }
  });
});
