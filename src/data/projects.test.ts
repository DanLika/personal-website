import { test, describe } from "node:test";
import * as assert from "node:assert";
import { getNextProject, projectsData } from "./projects.ts";

describe("getNextProject", () => {
  test("returns the next project for a valid middle project", () => {
    // bookbed-saas -> ironlife -> pizzeria-bestek -> flutterflow-templates -> apartment-templates
    const currentId = "bookbed-saas";
    const nextProject = getNextProject(currentId);

    assert.ok(nextProject !== null, "Should not return null");
    assert.strictEqual(nextProject.id, "ironlife");
  });

  test("loops back to the first project if the current project is the last one", () => {
    // The last key in projectsData is 'apartment-templates'
    const currentId = "apartment-templates";
    const nextProject = getNextProject(currentId);

    assert.ok(nextProject !== null, "Should not return null");
    assert.strictEqual(nextProject.id, "bookbed-saas");
  });

  test("returns the first project when an invalid ID is provided", () => {
    // indexOf returns -1 for an invalid ID.
    // currentIndex + 1 = 0.
    // 0 % length = 0.
    // It should return the first project ('bookbed-saas').
    const currentId = "invalid-project-id";
    const nextProject = getNextProject(currentId);

    assert.ok(nextProject !== null, "Should not return null");
    assert.strictEqual(nextProject.id, "bookbed-saas");
  });

  test("verifies the progression through all projects dynamically", () => {
    const keys = Object.keys(projectsData);
    assert.ok(keys.length > 0, "There should be at least one project");

    for (let i = 0; i < keys.length; i++) {
      const currentId = keys[i];
      const expectedNextId = keys[(i + 1) % keys.length];

      const nextProject = getNextProject(currentId);

      assert.ok(nextProject !== null, "Should not return null");
      assert.strictEqual(nextProject.id, expectedNextId);
    }
  });
});
