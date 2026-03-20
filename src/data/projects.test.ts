import { describe, it } from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

describe("getNextProject", () => {
  it("should return the next project when given a valid ID", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length >= 2) {
      const firstId = projectIds[0];
      const secondId = projectIds[1];
      const nextProject = getNextProject(firstId);
      assert.notEqual(nextProject, null);
      assert.equal(nextProject?.id, secondId);
    }
  });

  it("should wrap around to the first project when given the last project ID", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length > 0) {
      const lastId = projectIds[projectIds.length - 1];
      const firstId = projectIds[0];
      const nextProject = getNextProject(lastId);
      assert.notEqual(nextProject, null);
      assert.equal(nextProject?.id, firstId);
    }
  });

  it("should return the first project when given an invalid ID", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length > 0) {
      const firstId = projectIds[0];
      // When invalid id is provided, indexOf returns -1.
      // (-1 + 1) % length = 0 % length = 0, so it returns the first project.
      const nextProject = getNextProject("invalid-id-xyz");
      assert.notEqual(nextProject, null);
      assert.equal(nextProject?.id, firstId);
    }
  });
});
