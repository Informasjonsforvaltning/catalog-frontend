import { test as base } from "@playwright/test";
import CatalogPortalPage from "../page-object-model/catalogPortalPage";
import LoginPage from "../page-object-model/loginPage";
import { adminAuthFile, generateAccessibilityBuilder } from "../utils/helpers";

const PREFIX_TEXT = "catalog-portal: ";
export const test = base.extend<{
  loginPage: any;
  catalogPortalPage: any;
}>({
  loginPage: async ({ page, context }: any, use: any) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  catalogPortalPage: async ({ page, context }: any, use: any) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const catalogPortalPage = new CatalogPortalPage(
      page,
      context,
      accessibilityBuilder,
    );
    await use(catalogPortalPage);
  },
});

export const runTest = (name: string, fn: (any: any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (any: any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export { expect } from "@playwright/test";
