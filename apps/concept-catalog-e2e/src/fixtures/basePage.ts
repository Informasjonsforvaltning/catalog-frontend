import { test as base } from "@playwright/test";
import HomePage from "../page-object-model/homePage";
import LoginPage from "../page-object-model/loginPage";
import ConceptsPage from "../page-object-model/conceptsPage";
import { adminAuthFile, generateAccessibilityBuilder } from "../utils/helpers";

const PREFIX_TEXT = "concept-catalog: ";
export const test = base.extend<{
  loginPage: any;
  homePage: any;
  conceptsPage: any;
}>({
  loginPage: async (
    { page, context }: { page: any; context: any },
    use: any,
  ) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  homePage: async (
    { page, context }: { page: any; context: any },
    use: any,
  ) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const homePage = new HomePage(page, context, accessibilityBuilder);
    await use(homePage);
  },
  conceptsPage: async (
    { page, context }: { page: any; context: any },
    use: any,
  ) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const conceptsPage = new ConceptsPage(page, context, accessibilityBuilder);
    await use(conceptsPage);
  },
});

export const runTest = (name: string, fn: (args: any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (args: any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export { expect } from "@playwright/test";
