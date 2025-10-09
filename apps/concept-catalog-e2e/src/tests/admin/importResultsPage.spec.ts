import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile } from '../../utils/helpers';
import {expect} from "@playwright/test";

runTestAsAdmin('test import results page renders correctly', async ({ importResultsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  console.log('[TEST] Navigating to ImportResults page...');
  await importResultsPage.goto();

  console.log('[TEST] Navigated to ImportResults page...');

  console.log('[TEST] Expecting URLs to be visible...');
  await importResultsPage.expectImportResultUrl();
  console.log('[TEST] URLs to are visible...');

  console.log('[TEST] Expecting filters to be invisible by default...');
  await importResultsPage.expectFiltersToBeInvisible();
  console.log('[TEST] Filters are invisible by default...');

  console.log('[TEST] Expecting filters to be visible after clicking on Status...');
  await importResultsPage.page.getByRole('button', { name: 'Status' }).click({timeout: 20000});
  await importResultsPage.expectFiltersToBeVisible();
  console.log('[TEST] Filters are visible after clicking on Status...');

});

runTestAsAdmin('Test going to Import results page when clicking on Results button in the import modal', async ({ conceptsPage, playwright }) => {
    // Admin Access user
    console.log('[TEST] Creating API request context for Admin user...');
    const apiRequestContext = await playwright.request.newContext({
        storageState: adminAuthFile,
    });

    await conceptsPage.goto();

    // Click the Import button
    console.log('[TEST] Clicking on import button...');
    await conceptsPage.page.getByRole('button', { name: 'Importer' }).click();

    const dialog = conceptsPage.page.getByRole('dialog', {
        has: conceptsPage.page.getByRole('link', { name: 'Resultater' }),
    });

    // click the Import results button
    console.log('[TEST] Clicking on results button...');
    //await conceptsPage.page.getByRole('button', { name: 'Resultater' }).click();
    dialog.getByRole('link', { name: 'Resultater' }).click({timeout: 20000});

    // Wait for navigation to complete
    console.log('[TEST] Test Navigation to importResults...');
    await expect(conceptsPage.page).toHaveURL(conceptsPage.importResultsPage.url, { timeout: 20000 });
});