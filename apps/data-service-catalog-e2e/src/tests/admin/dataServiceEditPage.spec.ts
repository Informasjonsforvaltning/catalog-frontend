import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import DataServiceEditPage from '../../page-object-model/dataServiceEditPage';
import { adminAuthFile, createDataService, deleteDataService } from '../../utils/helpers';
import { getRandomDataService, getMinimalDataService } from '../../utils/dataService';

runTestAsAdmin('should create new data service', async ({ page, playwright, accessibilityBuilder }) => {
  const dataService = getRandomDataService();
  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);

  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);
  await dataServiceEditPage.expectNewDataServicePageUrl(process.env.E2E_CATALOG_ID as any);

  // Fill the form
  await dataServiceEditPage.fillDataServiceForm(dataService);

  // Save the data service
  await dataServiceEditPage.clickSave();

  // Wait for redirect to detail page
  await expect(page).toHaveURL(/\/catalogs\/.*\/data-services\/.*\/edit/);
});

runTestAsAdmin('should edit existing data service', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create a data service first
  const originalDataService = getMinimalDataService();
  const createdDataService = await createDataService(apiRequestContext, originalDataService);

  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);
  await dataServiceEditPage.goto(process.env.E2E_CATALOG_ID as any, createdDataService.id);

  // Verify initial values
  await dataServiceEditPage.expectTitleToBe(originalDataService.title);
  await dataServiceEditPage.expectDescriptionToBe(originalDataService.description);
  await dataServiceEditPage.expectEndpointUrlToBe(originalDataService.endpointUrl);

  // Update the data service
  const updatedTitle = { nb: 'Updated Title', nn: 'Oppdatert Tittel', en: 'Updated Title' };
  await dataServiceEditPage.fillTitle(updatedTitle, [], false);

  // Save changes
  await dataServiceEditPage.clickSave();

  // Verify the changes were saved
  await dataServiceEditPage.expectTitleToBe(updatedTitle);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin('should show all form fields', async ({ page, playwright, accessibilityBuilder }) => {
  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);
  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);

  // Verify all form fields are visible
  await expect(dataServiceEditPage.titleGroup).toBeVisible();
  await expect(dataServiceEditPage.descriptionGroup).toBeVisible();
  await expect(dataServiceEditPage.endpointUrlInput).toBeVisible();
  await expect(dataServiceEditPage.keywordsGroup).toBeVisible();
  await expect(dataServiceEditPage.contactNameGroup).toBeVisible();
  await expect(dataServiceEditPage.statusGroup).toBeVisible();
  await expect(dataServiceEditPage.licenseGroup).toBeVisible();
  await expect(dataServiceEditPage.accessRightsGroup).toBeVisible();
  await expect(dataServiceEditPage.availabilityGroup).toBeVisible();

  // Verify buttons are visible
  await dataServiceEditPage.expectSaveButtonVisible();
  await dataServiceEditPage.expectCancelButtonVisible();
});

runTestAsAdmin('should validate required fields', async ({ page, playwright, accessibilityBuilder }) => {
  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);
  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);

  await dataServiceEditPage.fillDescription({ nb: 'Test Description' }, ['Bokmål']);
  // Try to save without filling required fields
  await dataServiceEditPage.clickSave();

  // Should show validation errors
  await expect(dataServiceEditPage.titleGroup.getByText('Må fylles ut for minst ett språk.')).toBeVisible();
  await expect(page.getByText('Endepunkt må fylles ut.')).toBeVisible();
  await expect(dataServiceEditPage.contactNameGroup.getByText('Må fylles ut for minst ett språk.')).toBeVisible();
});

runTestAsAdmin('should handle form cancellation', async ({ page, playwright, accessibilityBuilder }) => {
  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);
  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);

  // Fill some data
  await dataServiceEditPage.fillTitle({ nb: 'Test Title' }, ['Bokmål']);

  // Click cancel
  await dataServiceEditPage.clickCancel();

  // Should redirect back to data services list
  await expect(page).toHaveURL(/\/catalogs\/.*\/data-services/);
});

runTestAsAdmin('should auto-save form data', async ({ page, playwright, accessibilityBuilder }) => {
  const dataServiceEditPage = new DataServiceEditPage(page, playwright, accessibilityBuilder);
  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);

  // Fill some data
  await dataServiceEditPage.fillTitle({ nb: 'Auto Save Test' }, ['Bokmål'], false);
  await dataServiceEditPage.fillDescription({ nb: 'Auto save description' }, ['Bokmål'], false);

  // Wait a moment for auto-save
  await page.waitForTimeout(2000);

  // Navigate away and back
  await page.goto('/');
  await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as any);

  // Should show restore dialog
  await expect(page.getByText('Vil du gjenopprette?')).toBeVisible();
});
