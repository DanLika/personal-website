import { describe, expect, test } from "bun:test";
import { getLatestBlogs, getAllBlogs } from "./blogs";

describe("getLatestBlogs", () => {
  test("returns 3 blogs by default", () => {
    const blogs = getLatestBlogs();
    expect(blogs.length).toBe(3);
  });

  test("returns the specified number of blogs", () => {
    const count = 5;
    const blogs = getLatestBlogs(count);
    expect(blogs.length).toBe(count);
  });

  test("returns 0 blogs when count is 0", () => {
    const blogs = getLatestBlogs(0);
    expect(blogs.length).toBe(0);
  });

  test("returns all blogs if count exceeds total blogs", () => {
    const allBlogs = getAllBlogs();
    const blogs = getLatestBlogs(allBlogs.length + 10);
    expect(blogs.length).toBe(allBlogs.length);
  });

  test("returns blogs in descending order of date (latest first)", () => {
    const blogs = getLatestBlogs(3);
    // As long as we have more than 1 blog, we can test order
    if (blogs.length > 1) {
      const date1 = new Date(blogs[0].date).getTime();
      const date2 = new Date(blogs[1].date).getTime();
      expect(date1).toBeGreaterThanOrEqual(date2);
    }
  });

  test("returns the exact same first N blogs as getAllBlogs", () => {
    const allBlogs = getAllBlogs();
    const count = Math.min(4, allBlogs.length);
    const latestBlogs = getLatestBlogs(count);

    expect(latestBlogs).toEqual(allBlogs.slice(0, count));
  });
});
