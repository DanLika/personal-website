import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

describe("projects data module", () => {
  describe("getNextProject", () => {
    test("returns the next project in the sequence", () => {
      const projectIds = Object.keys(projectsData);

      // Assume test fails if there's no data to test against (better practice)
      assert.ok(projectIds.length >= 2, "Need at least 2 projects to test normal progression");

      const firstProjectId = projectIds[0];
      const secondProjectId = projectIds[1];

      const nextProject = getNextProject(firstProjectId);
      assert.ok(nextProject);
      assert.strictEqual(nextProject.id, secondProjectId);
    });

    test("loops back to the first project when at the end of the sequence", () => {
      const projectIds = Object.keys(projectsData);
      assert.ok(projectIds.length >= 1, "Need at least 1 project to test looping");

      const lastProjectId = projectIds[projectIds.length - 1];
      const firstProjectId = projectIds[0];

      const nextProject = getNextProject(lastProjectId);
      assert.ok(nextProject);
      assert.strictEqual(nextProject.id, firstProjectId);
    });

    test("returns the first project when given an unknown ID", () => {
      const projectIds = Object.keys(projectsData);
      assert.ok(projectIds.length >= 1, "Need at least 1 project to test unknown ID");

      const firstProjectId = projectIds[0];
      const unknownId = "non-existent-project-id";

      const nextProject = getNextProject(unknownId);
      assert.ok(nextProject);

      // When ID is unknown, indexOf returns -1.
      // nextIndex = (-1 + 1) % length = 0 % length = 0
      // It should return the project at index 0
      assert.strictEqual(nextProject.id, firstProjectId);
    });
  });
});
