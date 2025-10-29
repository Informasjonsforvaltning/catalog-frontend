import { test as base } from '@playwright/test';
import HomePage from '../page-object-model/homePage';
import LoginPage from '../page-object-model/loginPage';
import DataServicesPage from '../page-object-model/dataServicesPage';
import { adminAuthFile, generateAccessibilityBuilder } from '../utils/helpers';

const PREFIX_TEXT = 'data-service-catalog: ';
export const test = base.extend<{
  loginPage: any;
  homePage: any;
  dataServicesPage: any;
  accessibilityBuilder: any;
}>({
  accessibilityBuilder: async ({ page }: any, use: any) => {
    const builder = await generateAccessibilityBuilder(page);
    await use(builder);
  },
  loginPage: async ({ page, context, accessibilityBuilder }: any, use: any) => {
    const loginPage = new LoginPage(page, context, accessibilityBuilder);
    await use(loginPage);
  },
  homePage: async ({ page, context, accessibilityBuilder }: any, use: any) => {
    const homePage = new HomePage(page, context, accessibilityBuilder);
    await use(homePage);
  },
  dataServicesPage: async ({ page, context, accessibilityBuilder }: any, use: any) => {
    const dataServicesPage = new DataServicesPage(page, context, accessibilityBuilder);
    await use(dataServicesPage);
  },
});

export const runTest = (name: string, fn: (any: any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (any: any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export { expect } from '@playwright/test';
