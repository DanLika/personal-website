import * as assert from "node:assert";
import test from "node:test";
import { blogsData, getAllBlogs, getLatestBlogs } from "./blogs.ts";

test("getAllBlogs correctly sorts blogs by newest date first", () => {
    const sortedBlogs = getAllBlogs();
    assert.strictEqual(sortedBlogs.length, blogsData.length, "Should return all blogs");

    for (let i = 0; i < sortedBlogs.length - 1; i++) {
        const currentDate = new Date(sortedBlogs[i].date).getTime();
        const nextDate = new Date(sortedBlogs[i + 1].date).getTime();

        assert.ok(
            currentDate >= nextDate,
            `Blog at index ${i} (date: ${sortedBlogs[i].date}) should be newer or equal to blog at index ${i + 1} (date: ${sortedBlogs[i + 1].date})`
        );
    }
});

test("getLatestBlogs returns correct number of blogs", () => {
    const latest3 = getLatestBlogs(); // Default is 3
    assert.strictEqual(latest3.length, Math.min(3, blogsData.length), "Should return default 3 blogs or max available");

    const latest5 = getLatestBlogs(5);
    assert.strictEqual(latest5.length, Math.min(5, blogsData.length), "Should return 5 blogs or max available");
});

test("getLatestBlogs correctly sorts the returned blogs", () => {
    const latest = getLatestBlogs(5);

    for (let i = 0; i < latest.length - 1; i++) {
        const currentDate = new Date(latest[i].date).getTime();
        const nextDate = new Date(latest[i + 1].date).getTime();

        assert.ok(
            currentDate >= nextDate,
            `Latest blog at index ${i} should be newer or equal to blog at index ${i + 1}`
        );
    }
});

test("getLatestBlogs handles edge case counts", () => {
    const negativeCount = getLatestBlogs(-1);
    assert.strictEqual(negativeCount.length, 0, "Should return 0 blogs for negative count");

    const zeroCount = getLatestBlogs(0);
    assert.strictEqual(zeroCount.length, 0, "Should return 0 blogs for zero count");

    const largeCount = getLatestBlogs(100000);
    assert.strictEqual(largeCount.length, blogsData.length, "Should return all blogs for excessively large count");
});
