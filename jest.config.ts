import { workspaceRoot } from "@nx/devkit";
import { readdirSync } from "fs";
import { join } from "path";

function getProjects() {
  const appsDir = join(workspaceRoot, "apps");
  const libsDir = join(workspaceRoot, "libs");
  return [
    ...readdirSync(appsDir).map((dir) => `<rootDir>/apps/${dir}`),
    ...readdirSync(libsDir).map((dir) => `<rootDir>/libs/${dir}`),
  ];
}

export default {
  projects: getProjects(),
};
