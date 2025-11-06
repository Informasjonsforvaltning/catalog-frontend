import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";
import path = require("path");
import * as dotenv from "dotenv";

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env["BASE_URL"] || "http://localhost:4200";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, ".env.e2e.local") });

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
        outputFile: "concept-catalog-ctrf-report.json",
        outputDir: path.resolve(__dirname, "../../reports"),
        appName: "concept-catalog",
        testEnvironment: "staging",
      },
    ],
  ],
  retries: 2,
  workers: 3,
  timeout: 180 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on", // Captures a trace for each test
    screenshot: "on", // Takes screenshots on test failures
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: "yarn nx serve concept-catalog --configuration=e2e",
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
    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
