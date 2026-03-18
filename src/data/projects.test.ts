import { expect, test, describe } from "bun:test";
import { getNextProject, projectsData } from "./projects";

describe("getNextProject", () => {
  test("returns the second project when given the first project ID", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length >= 2) {
      const firstId = projectIds[0];
      const secondId = projectIds[1];
      const nextProject = getNextProject(firstId);
      expect(nextProject?.id).toBe(secondId);
    }
  });

  test("returns the first project when given the last project ID (modulo wrap-around)", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length >= 1) {
      const lastId = projectIds[projectIds.length - 1];
      const firstId = projectIds[0];
      const nextProject = getNextProject(lastId);
      expect(nextProject?.id).toBe(firstId);
    }
  });

  test("returns the first project when given an invalid project ID", () => {
    const projectIds = Object.keys(projectsData);
    if (projectIds.length >= 1) {
      const firstId = projectIds[0];
      const nextProject = getNextProject("invalid-project-id-123");
      // indexOf returns -1, currentIndex + 1 becomes 0.
      expect(nextProject?.id).toBe(firstId);
    }
  });
});
