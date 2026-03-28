import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

describe("getNextProject", () => {
  test("returns the next project in normal progression", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length < 2) return; // Need at least 2 for progression test

    const firstProjectId = projectIds[0];
    const secondProjectId = projectIds[1];

    const result = getNextProject(firstProjectId);
    assert.strictEqual(result, projectsData[secondProjectId]);
  });

  test("loops back to the first project when at the last project", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length === 0) return;

    const lastProjectId = projectIds[projectIds.length - 1];
    const firstProjectId = projectIds[0];

    const result = getNextProject(lastProjectId);
    assert.strictEqual(result, projectsData[firstProjectId]);
  });

  test("returns the first project if the currentProjectId is not found (fallback index 0)", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length === 0) return;

    const firstProjectId = projectIds[0];
    const result = getNextProject("non-existent-id-1234");
    assert.strictEqual(result, projectsData[firstProjectId]);
  });
});
