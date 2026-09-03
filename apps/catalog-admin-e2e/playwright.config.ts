import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";
import path = require("path");
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env.e2e.local") });

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env["BASE_URL"] || "http://localhost:4200";

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: __dirname }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  reporter: [
    ["list"], // You can combine multiple reporters
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "catalog-admin-ctrf-report.json",
        outputDir: path.resolve(__dirname, "../../reports"),
        appName: "catalog-admin",
        testEnvironment: "staging",
      },
    ],
  ],
  retries: 2,
  workers: 4,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command:
      "yarn kill-port 4200 && yarn nx run catalog-admin:build:production && yarn nx serve catalog-admin --configuration=e2e",
    url: "http://127.0.0.1:4200",
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    // e2e runs against a production build (next start), which needs time to
    // compile before the server is ready — well beyond Playwright's 60s default.
    timeout: 300 * 1000,
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
