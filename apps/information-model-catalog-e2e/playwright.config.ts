import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";
import * as path from "path";
import * as dotenv from "dotenv";

const baseURL = process.env["BASE_URL"] || "http://localhost:4200";

dotenv.config({ path: path.resolve(__dirname, ".env.e2e.local") });

// Scopes test data to this run so concurrent runs don't clean up each other's models.
process.env.E2E_RUN_ID ??= process.env.GITHUB_RUN_ID
  ? `gh${process.env.GITHUB_RUN_ID}x${process.env.GITHUB_RUN_ATTEMPT ?? "1"}`
  : `local${Date.now().toString(36)}`;

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: __dirname }),
  reporter: [
    ["list"],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "information-model-catalog-ctrf-report.json",
        outputDir: path.resolve(__dirname, "../../reports"),
        appName: "information-model-catalog",
        testEnvironment: "staging",
      },
    ],
  ],
  retries: 2,
  workers: 1,
  timeout: 180 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL,
    trace: "on",
    screenshot: "on",
  },
  webServer: {
    command: "yarn nx serve information-model-catalog --configuration=e2e",
    url: "http://127.0.0.1:4200",
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: "admin-login",
      dependencies: [],
      testMatch: "**/admin/loginPage.setup.ts",
    },
    {
      name: "admin-init",
      dependencies: ["admin-login"],
      testMatch: "**/admin/*.init.ts",
      teardown: "admin-teardown",
    },
    {
      name: "admin-teardown",
      testMatch: "**/admin/*.teardown.ts",
    },
    {
      name: "admin-chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["admin-init"],
      testMatch: "**/admin/*.spec.ts",
    },
    {
      name: "admin-firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["admin-init"],
      testMatch: "**/admin/*.spec.ts",
    },
  ],
});
