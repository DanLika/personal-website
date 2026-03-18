import { expect, test, describe } from "bun:test";
import { getAllBlogs, blogsData } from "../blogs";

describe("getAllBlogs", () => {
  test("returns all blogs from blogsData", () => {
    const result = getAllBlogs();
    expect(result.length).toBe(blogsData.length);
  });

  test("returns blogs sorted by date in descending order (newest first)", () => {
    const result = getAllBlogs();

    // Check that each date is less than or equal to the previous date
    for (let i = 1; i < result.length; i++) {
      const prevDate = new Date(result[i - 1].date).getTime();
      const currDate = new Date(result[i].date).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  test("does not mutate the original blogsData array", () => {
    // Create a shallow copy of the original array to compare against later
    const originalDataCopy = [...blogsData];

    // Call the function
    getAllBlogs();

    // The original array should remain unchanged
    expect(blogsData).toEqual(originalDataCopy);
  });
});
