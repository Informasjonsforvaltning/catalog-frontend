import { test as base } from '@playwright/test';
import HomePage from '../page-object-model/homePage';
import LoginPage from '../page-object-model/loginPage';
import { adminAuthFile, generateAccessibilityBuilder } from '../utils/helpers';

const PREFIX_TEXT = 'catalog-portal: ';
export const test = base.extend<{
  loginPage: any;
  homePage: any;
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
});

export const runTest = (name: string, fn: (any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export { expect } from '@playwright/test';
