import { test as base } from "@playwright/test";
import HomePage from "../page-object-model/homePage";
import LoginPage from "../page-object-model/loginPage";
import ConceptsPage from "../page-object-model/conceptsPage";
import { adminAuthFile, generateAccessibilityBuilder } from "../utils/helpers";

const PREFIX_TEXT = "concept-catalog: ";
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  conceptsPage: ConceptsPage;
}>({
  loginPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  homePage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const homePage = new HomePage(page, context, accessibilityBuilder);
    await use(homePage);
  },
  conceptsPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const conceptsPage = new ConceptsPage(page, context, accessibilityBuilder);
    await use(conceptsPage);
  },
});

export const runTest = (name: string, fn: (e: any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const skipTest = (name: string, fn: (e: any) => void) => {
  test.skip(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (e: any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export const runSerialTestsAdmin = (
  name: string,
  tests: { name: string; fn: (e: any) => void }[],
  skippedTests?: { name: string; fn: (e: any) => void }[],
) => {
  test.describe.serial(PREFIX_TEXT + name, () => {
    test.use({ storageState: adminAuthFile });

    for (const { name: testName, fn } of tests) {
      test(testName, fn);
    }
  });

  if (!skippedTests) return;
  for (const { name: testName, fn } of skippedTests) {
    test.skip(PREFIX_TEXT + testName, fn);
  }
};

export const skipTestAsAdmin = (name: string, fn: (e: any) => void) => {
  test.use({ storageState: adminAuthFile });
  skipTest(name, fn);
};

export { expect } from "@playwright/test";
