import { test as base } from '@playwright/test';
import HomePage from '../page-object-model/homePage';
import LoginPage from '../page-object-model/loginPage';
import ConceptsPage from '../page-object-model/conceptsPage';
import ImportResultsPage from '../page-object-model/importResultsPage';
import ImportResultDetailsPage from '../page-object-model/importResultDetailsPage';
import { adminAuthFile, generateAccessibilityBuilder } from '../utils/helpers';

const PREFIX_TEXT = 'concept-catalog: ';
export const test = base.extend<{
  loginPage: any;
  homePage: any;
  conceptsPage: any;
  importResultsPage: any;
  importResultDetailsPage: any;
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
  importResultsPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const importResultsPage = new ImportResultsPage(page, context, accessibilityBuilder);
    await use(importResultsPage);
  },
  importResultDetailsPage: async ({ page, context }, use) => {
    const accessibilityBuilder = await generateAccessibilityBuilder(page);
    const importResultDetailsPage = new ImportResultDetailsPage(page, context, accessibilityBuilder);
    await use(importResultDetailsPage);
  },
});

export const runTest = (name: string, fn: (any) => void) => {
  test(PREFIX_TEXT + name, fn);
};

export const skipTest = (name: string, fn: (any) => void) => {
  test.skip(PREFIX_TEXT + name, fn);
};

export const runTestAsAdmin = (name: string, fn: (any) => void) => {
  test.use({ storageState: adminAuthFile });
  runTest(name, fn);
};

export const runSerialTestsAdmin = (name: string, tests: {name: string, fn: (any)  => void} []) => {
  test.use({ storageState: adminAuthFile });
  test.describe.serial(PREFIX_TEXT + ' serial tests ' + name, () => {

    for (const { name, fn } of tests){
      test.use({ storageState: adminAuthFile });
      runTest(`${PREFIX_TEXT} ${name}`, fn);
    }

  });
}

export const skipTestAsAdmin = (name: string, fn: (any) => void) => {
  test.use({ storageState: adminAuthFile });
  skipTest(name, fn);
};

export { expect } from '@playwright/test';
