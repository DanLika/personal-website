import { test, describe, beforeEach, afterEach } from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";
import type { ProjectData } from "./projects.ts";

describe("projects data module", () => {
  describe("getNextProject", () => {
    // Save original keys and values so we can restore them later
    const originalKeys = Object.keys(projectsData);
    const originalData: Record<string, ProjectData> = {};

    beforeEach(() => {
      // Backup original data
      for (const key of originalKeys) {
        originalData[key] = projectsData[key];
        delete projectsData[key];
      }

      // Inject a mock Record object for predictable testing
      projectsData["mock-id-1"] = { id: "mock-id-1" } as ProjectData;
      projectsData["mock-id-2"] = { id: "mock-id-2" } as ProjectData;
      projectsData["mock-id-3"] = { id: "mock-id-3" } as ProjectData;
    });

    afterEach(() => {
      // Clear mock data
      for (const key of Object.keys(projectsData)) {
        delete projectsData[key];
      }

      // Restore original data
      for (const key of originalKeys) {
        projectsData[key] = originalData[key];
      }
    });

    test("returns the next project in the sequence", () => {
      const nextProject = getNextProject("mock-id-1");
      assert.ok(nextProject);
      assert.strictEqual(nextProject.id, "mock-id-2");

      const nextProject2 = getNextProject("mock-id-2");
      assert.ok(nextProject2);
      assert.strictEqual(nextProject2.id, "mock-id-3");
    });

    test("loops back to the first project when at the end of the sequence", () => {
      const nextProject = getNextProject("mock-id-3");
      assert.ok(nextProject);
      assert.strictEqual(nextProject.id, "mock-id-1");
    });

    test("returns the first project when given an unknown ID", () => {
      // When ID is unknown, indexOf returns -1.
      // nextIndex = (-1 + 1) % length = 0 % length = 0
      // It should return the project at index 0
      const nextProject = getNextProject("unknown-id");
      assert.ok(nextProject);
      assert.strictEqual(nextProject.id, "mock-id-1");
    });
  });
});
