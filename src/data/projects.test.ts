import { describe, test } from "node:test";
import assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

describe("getNextProject", () => {
  test("returns the second project when given the first project ID", () => {
    const projectIds = Object.keys(projectsData);
    assert.ok(projectIds.length >= 2, "Test requires at least two projects in projectsData");

    const firstId = projectIds[0];
    const secondId = projectIds[1];

    const nextProject = getNextProject(firstId);
    assert.strictEqual(nextProject?.id, secondId);
  });

  test("returns the first project when given the last project ID (modulo wrap-around)", () => {
    const projectIds = Object.keys(projectsData);
    assert.ok(projectIds.length >= 1, "Test requires at least one project in projectsData");

    const lastId = projectIds[projectIds.length - 1];
    const firstId = projectIds[0];

    const nextProject = getNextProject(lastId);
    assert.strictEqual(nextProject?.id, firstId);
  });

  test("returns the first project when given an invalid project ID", () => {
    const projectIds = Object.keys(projectsData);
    assert.ok(projectIds.length >= 1, "Test requires at least one project in projectsData");

    const firstId = projectIds[0];
    const nextProject = getNextProject("invalid-project-id-123");

    // indexOf returns -1, currentIndex + 1 becomes 0.
    assert.strictEqual(nextProject?.id, firstId);
  });
});
