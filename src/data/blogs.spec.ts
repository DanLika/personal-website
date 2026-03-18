import { describe, it, expect } from "bun:test";
import { getPreviousBlog, getAllBlogs, getNextBlog, getLatestBlogs, getBlogBySlug } from "./blogs";

describe("Blog Navigation", () => {
  describe("getPreviousBlog", () => {
    it("should return the previous blog in the list", () => {
      const blogs = getAllBlogs();
      // Test requires at least 2 blogs to verify normal previous navigation
      if (blogs.length >= 2) {
        const previous = getPreviousBlog(blogs[1].slug);
        expect(previous?.slug).toBe(blogs[0].slug);
      }
    });

    it("should loop back to the last blog if current is the first blog", () => {
      const blogs = getAllBlogs();
      if (blogs.length > 0) {
        const previous = getPreviousBlog(blogs[0].slug);
        expect(previous?.slug).toBe(blogs[blogs.length - 1].slug);
      }
    });

    it("should return the last blog if the slug is not found", () => {
      const blogs = getAllBlogs();
      if (blogs.length > 0) {
        const previous = getPreviousBlog("non-existent-slug");
        expect(previous?.slug).toBe(blogs[blogs.length - 1].slug);
      }
    });
  });

  describe("getNextBlog", () => {
    it("should return the next blog in the list", () => {
      const blogs = getAllBlogs();
      if (blogs.length >= 2) {
        const next = getNextBlog(blogs[0].slug);
        expect(next?.slug).toBe(blogs[1].slug);
      }
    });

    it("should loop back to the first blog if current is the last blog", () => {
      const blogs = getAllBlogs();
      if (blogs.length > 0) {
        const next = getNextBlog(blogs[blogs.length - 1].slug);
        expect(next?.slug).toBe(blogs[0].slug);
      }
    });

    it("should return the first blog if the slug is not found", () => {
      const blogs = getAllBlogs();
      if (blogs.length > 0) {
        const next = getNextBlog("non-existent-slug");
        expect(next?.slug).toBe(blogs[0].slug);
      }
    });
  });

  describe("Other blog functions", () => {
    it("getLatestBlogs should return requested amount", () => {
      const blogs = getAllBlogs();
      const count = Math.min(2, blogs.length);
      const latest = getLatestBlogs(count);

      expect(latest.length).toBe(count);
      if (count > 0) {
        expect(latest[0].slug).toBe(blogs[0].slug);
      }
    });

    it("getBlogBySlug should return correct blog or undefined", () => {
      const blogs = getAllBlogs();
      if (blogs.length > 0) {
        const blog = getBlogBySlug(blogs[0].slug);
        expect(blog?.slug).toBe(blogs[0].slug);

        const notFound = getBlogBySlug("does-not-exist");
        expect(notFound).toBeUndefined();
      }
    });
  });
});
