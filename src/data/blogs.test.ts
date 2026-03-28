import { describe, test } from "node:test";
import * as assert from "node:assert";
import * as blogsModule from "./blogs.ts";
import type { BlogPost } from "./blogs.ts";

describe("blogs.ts", () => {
  describe("getPreviousBlog", () => {
    test("returns the previous blog for an item in the middle of the list", () => {
      // Instead of mutating the array or mocking the exports directly,
      // we'll mutate the contents of the `blogsData` array itself.
      // This is a common way to mock module-level arrays in ES modules.

      const originalBlogsData = [...blogsModule.blogsData];

      const mockBlogs = [
        { slug: "blog-1", date: "2025-01-03" },
        { slug: "blog-2", date: "2025-01-02" },
        { slug: "blog-3", date: "2025-01-01" },
      ];

      blogsModule.blogsData.length = 0;
      blogsModule.blogsData.push(...mockBlogs as BlogPost[]);

      try {
        const expectedPreviousBlog = mockBlogs[1];
        const previousBlog = blogsModule.getPreviousBlog("blog-3");

        assert.deepEqual(previousBlog, expectedPreviousBlog);
      } finally {
        blogsModule.blogsData.length = 0;
        blogsModule.blogsData.push(...originalBlogsData);
      }
    });

    test("loops back to the last blog when provided the slug of the first blog", () => {
      const originalBlogsData = [...blogsModule.blogsData];

      const mockBlogs = [
        { slug: "blog-1", date: "2025-01-03" },
        { slug: "blog-2", date: "2025-01-02" },
        { slug: "blog-3", date: "2025-01-01" },
      ];

      blogsModule.blogsData.length = 0;
      blogsModule.blogsData.push(...mockBlogs as BlogPost[]);

      try {
        const expectedPreviousBlog = mockBlogs[2];
        const previousBlog = blogsModule.getPreviousBlog("blog-1");

        assert.deepEqual(previousBlog, expectedPreviousBlog);
      } finally {
        blogsModule.blogsData.length = 0;
        blogsModule.blogsData.push(...originalBlogsData);
      }
    });

    test("returns the last blog when a non-existent slug is provided", () => {
      const originalBlogsData = [...blogsModule.blogsData];

      const mockBlogs = [
        { slug: "blog-1", date: "2025-01-03" },
        { slug: "blog-2", date: "2025-01-02" },
        { slug: "blog-3", date: "2025-01-01" },
      ];

      blogsModule.blogsData.length = 0;
      blogsModule.blogsData.push(...mockBlogs as BlogPost[]);

      try {
        const expectedPreviousBlog = mockBlogs[2];
        const previousBlog = blogsModule.getPreviousBlog("non-existent-slug-12345");

        assert.deepEqual(previousBlog, expectedPreviousBlog);
      } finally {
        blogsModule.blogsData.length = 0;
        blogsModule.blogsData.push(...originalBlogsData);
      }
    });
  });
});
