import { test as base } from '@playwright/test';
import HomePage from '../page-object-model/homePage';
import LoginPage from '../page-object-model/loginPage';
import ServicesPage from '../page-object-model/servicesPage';
import PublicServicesPage from '../page-object-model/publicServicesPage';
import { adminAuthFile, generateAccessibilityBuilder } from '../utils/helpers';

const PREFIX_TEXT = 'service-catalog: ';
export const test = base.extend<{
  loginPage: any;
  homePage: any;
  servicesPage: any;
  publicServicesPage: any;
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
  servicesPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const servicesPage = new ServicesPage(page, context, accessibilityBuilder);
    await use(servicesPage);
  },
  publicServicesPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const publicServicesPage = new PublicServicesPage(page, context, accessibilityBuilder);
    await use(publicServicesPage);
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
