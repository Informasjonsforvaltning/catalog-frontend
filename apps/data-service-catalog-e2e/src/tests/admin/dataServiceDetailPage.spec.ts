import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import DataServiceDetailPage from '../../page-object-model/dataServiceDetailPage';
import { adminAuthFile, createDataService, deleteDataService, publishDataService } from '../../utils/helpers';
import { getRandomDataService } from '../../utils/dataService';

runTestAsAdmin('should display data service details', async ({ page, context, accessibilityBuilder, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Verify data service details are displayed
  await dataServiceDetailPage.expectTitleToBe(dataService.title.nb as string);
  await dataServiceDetailPage.expectDescriptionToBe(dataService.description.nb as string);
  await dataServiceDetailPage.expectEndpointUrlToBe(dataService.endpointUrl || '');

  // Verify buttons are visible
  await dataServiceDetailPage.expectEditButtonVisible();
  await dataServiceDetailPage.expectDeleteButtonVisible();
  await dataServiceDetailPage.expectPublishButtonVisible();

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin('should publish data service with confirmation', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Click publish switch to trigger confirmation modal
  await dataServiceDetailPage.publishSwitch.click();

  // Verify confirmation modal is visible and contains correct text
  await dataServiceDetailPage.expectConfirmModalVisible();
  await expect(page.locator('dialog[open]')).toContainText('Er du sikker på at du vil publisere API-beskrivelsen?');

  // Confirm the publish action
  await page.locator('dialog[open] button').first().click();

  // Verify modal is no longer visible
  await dataServiceDetailPage.expectConfirmModalNotVisible();

  // Verify the data service is now published
  await dataServiceDetailPage.expectPublishedStatusToBe(true);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin(
  'should unpublish data service with confirmation',
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataService = getRandomDataService();
    const createdDataService = await createDataService(apiRequestContext, dataService);

    // Publish the data service first
    await publishDataService(apiRequestContext, createdDataService.id);

    const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
    await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

    // Click unpublish switch to trigger confirmation modal
    await dataServiceDetailPage.publishSwitch.click();

    // Verify confirmation modal is visible and contains correct text
    await dataServiceDetailPage.expectConfirmModalVisible();
    await expect(page.locator('dialog[open]')).toContainText('Er du sikker på at du vil avpublisere API-beskrivelsen?');

    // Confirm the unpublish action
    await page.locator('dialog[open] button').first().click();

    // Verify modal is no longer visible
    await dataServiceDetailPage.expectConfirmModalNotVisible();

    // Verify the data service is now unpublished
    await dataServiceDetailPage.expectPublishedStatusToBe(false);

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin('should cancel publish confirmation modal', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Click publish switch to trigger confirmation modal
  await dataServiceDetailPage.publishSwitch.click();

  // Verify confirmation modal is visible
  await dataServiceDetailPage.expectConfirmModalVisible();

  // Verify modal has the correct buttons
  await expect(page.locator('dialog[open] button').first()).toHaveText('Publiser');
  await expect(page.locator('dialog[open] button').nth(1)).toHaveText('Avbryt');

  // Cancel the modal
  await page.locator('dialog[open] button').nth(1).click();

  // Verify modal is no longer visible
  await dataServiceDetailPage.expectConfirmModalNotVisible();

  // Verify the data service is still unpublished
  await dataServiceDetailPage.expectPublishedStatusToBe(false);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin('should navigate to edit page', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Click edit button
  await dataServiceDetailPage.clickEdit();

  // Verify navigation to edit page
  await dataServiceDetailPage.expectDataServiceDetailPageUrl(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin('should delete data service with confirmation', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Click delete button to trigger confirmation modal
  await dataServiceDetailPage.deleteButton.click();

  // Verify confirmation modal is visible and contains correct text
  await dataServiceDetailPage.expectConfirmModalVisible();
  await expect(page.locator('dialog[open]')).toContainText('Er du sikker på at du vil slette API-beskrivelsen?');

  // Verify modal has the correct buttons
  await expect(page.locator('dialog[open] button').first()).toHaveText('Slett');
  await expect(page.locator('dialog[open] button').nth(1)).toHaveText('Avbryt');

  // Confirm the delete action
  await page.locator('dialog[open] button').first().click();

  // Should redirect to data services list
  await expect(page).toHaveURL(/\/catalogs\/.*\/data-services/);
});

runTestAsAdmin('should cancel delete confirmation modal', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Click delete button to trigger confirmation modal
  await dataServiceDetailPage.deleteButton.click();

  // Verify confirmation modal is visible
  await dataServiceDetailPage.expectConfirmModalVisible();

  // Cancel the modal
  await page.locator('dialog[open] button').nth(1).click();

  // Verify modal is no longer visible
  await dataServiceDetailPage.expectConfirmModalNotVisible();

  // Verify we're still on the detail page
  await dataServiceDetailPage.expectDataServiceDetailPageUrl(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});

runTestAsAdmin('should show correct URL structure', async ({ page, playwright, accessibilityBuilder }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataService();
  const createdDataService = await createDataService(apiRequestContext, dataService);

  const dataServiceDetailPage = new DataServiceDetailPage(page, playwright, accessibilityBuilder);
  await dataServiceDetailPage.goto(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Verify correct URL structure
  await dataServiceDetailPage.expectDataServiceDetailPageUrl(process.env.E2E_CATALOG_ID, createdDataService.id);

  // Clean up
  await deleteDataService(apiRequestContext, createdDataService.id);
});
