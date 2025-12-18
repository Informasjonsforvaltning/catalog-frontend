import { test as base } from "@playwright/test";
import HomePage from "../page-object-model/homePage";
import LoginPage from "../page-object-model/loginPage";
import DataServicesPage from "../page-object-model/dataServicesPage";
import { adminAuthFile, generateAccessibilityBuilder } from "../utils/helpers";
import AxeBuilder from "@axe-core/playwright";

const PREFIX_TEXT = "data-service-catalog: ";
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  dataServicesPage: DataServicesPage;
  accessibilityBuilder: AxeBuilder;
}>({
  accessibilityBuilder: async ({ page }, use) => {
    const builder = await generateAccessibilityBuilder(page);
    await use(builder);
  },
  loginPage: async ({ page, context, accessibilityBuilder }, use) => {
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  homePage: async ({ page, context, accessibilityBuilder }, use) => {
    const homePage = new HomePage(page, context, accessibilityBuilder);
    await use(homePage);
  },
  dataServicesPage: async ({ page, context, accessibilityBuilder }, use) => {
    const dataServicesPage = new DataServicesPage(
      page,
      context,
      accessibilityBuilder,
    );
    await use(dataServicesPage);
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
