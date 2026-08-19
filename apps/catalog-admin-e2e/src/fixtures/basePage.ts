import { test as base } from "@playwright/test";
import CatalogAdminPage from "../page-object-model/catalogAdminPage";
import LoginPage from "../page-object-model/loginPage";
import { adminAuthFile, generateAccessibilityBuilder } from "../utils/helpers";

const PREFIX_TEXT = "catalog-admin: ";
export const test = base.extend<{
  loginPage: LoginPage;
  catalogAdminPage: CatalogAdminPage;
}>({
  loginPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  catalogAdminPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const catalogAdminPage = new CatalogAdminPage(
      page,
      context,
      accessibilityBuilder,
    );
    await use(catalogAdminPage);
  },
});

export const runTest = (name: string, fn: (e: any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (e: any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export { expect } from "@playwright/test";
