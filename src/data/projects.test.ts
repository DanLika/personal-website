import test from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

test("getNextProject", async (t) => {
  const projectIds = Object.keys(projectsData);

  await t.test("returns the next project in regular progression", () => {
    // Assuming there are at least two projects
    if (projectIds.length >= 2) {
      const firstProjectId = projectIds[0];
      const secondProjectId = projectIds[1];
      const nextProject = getNextProject(firstProjectId);

      assert.ok(nextProject !== null);
      assert.strictEqual(nextProject.id, secondProjectId);
    }
  });

  await t.test("loops back to the first project when at the last project", () => {
    if (projectIds.length >= 1) {
      const lastProjectId = projectIds[projectIds.length - 1];
      const firstProjectId = projectIds[0];
      const nextProject = getNextProject(lastProjectId);

      assert.ok(nextProject !== null);
      assert.strictEqual(nextProject.id, firstProjectId);
    }
  });

  await t.test("returns the first project for invalid project ID", () => {
    if (projectIds.length >= 1) {
      const firstProjectId = projectIds[0];
      // An invalid project ID will give indexOf = -1
      // nextIndex = (-1 + 1) % length = 0 % length = 0
      const nextProject = getNextProject("invalid-project-id");

      assert.ok(nextProject !== null);
      assert.strictEqual(nextProject.id, firstProjectId);
    }
  });
});
