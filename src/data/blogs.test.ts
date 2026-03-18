import { expect, test, describe } from "bun:test";
import { getBlogBySlug, blogsData } from "./blogs";

describe("getBlogBySlug", () => {
  test("returns the correct blog post for a valid slug", () => {
    const validSlug = blogsData[0].slug;
    const post = getBlogBySlug(validSlug);
    expect(post).toBeDefined();
    expect(post?.slug).toBe(validSlug);
    expect(post).toEqual(blogsData[0]);
  });

  test("returns undefined for a non-existent slug", () => {
    const post = getBlogBySlug("non-existent-slug");
    expect(post).toBeUndefined();
  });

  test("returns undefined for an empty string slug", () => {
    const post = getBlogBySlug("");
    expect(post).toBeUndefined();
  });

  test("returns undefined for a null-like or undefined-like string if that matches no post", () => {
    const post = getBlogBySlug("null");
    expect(post).toBeUndefined();
  });
});
