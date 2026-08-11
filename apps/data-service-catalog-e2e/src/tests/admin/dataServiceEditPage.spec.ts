import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import DataServiceEditPage from "../../page-object-model/dataServiceEditPage";
import DataServiceDetailPage from "../../page-object-model/dataServiceDetailPage";
import {
  adminAuthFile,
  createDataService,
  deleteDataService,
  uniqueString,
} from "../../utils/helpers";
import { getRandomDataService } from "../../utils/dataService";

const WHITESPACE_TITLE = "Test whitespace";

runTestAsAdmin(
  "should create new data service",
  async ({ page, playwright, accessibilityBuilder }) => {
    const dataService = getRandomDataService();
    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );

    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);
    await dataServiceEditPage.expectNewDataServicePageUrl(
      process.env.E2E_CATALOG_ID as string,
    );

    // Fill the form
    await dataServiceEditPage.fillDataServiceForm(dataService);

    // Save the data service
    await dataServiceEditPage.clickSave();

    // Wait for redirect to detail page
    await expect(page).toHaveURL(/\/catalogs\/.*\/data-services\/.*\/edit/);
  },
);

runTestAsAdmin(
  "should edit existing data service",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // getRandomDataService rather than getMinimalDataService: the latter has no
    // contact point, which the form requires, so the save would be rejected by
    // validation and this test would pass without anything being saved
    const originalDataService = getRandomDataService();
    const createdDataService = await createDataService(
      apiRequestContext,
      originalDataService,
    );

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );

    // Verify initial values
    await dataServiceEditPage.expectTitleToBe(originalDataService.title);
    await dataServiceEditPage.expectDescriptionToBe(
      originalDataService.description,
    );
    await dataServiceEditPage.expectEndpointUrlToBe(
      originalDataService.endpointUrl,
    );

    // Update the data service
    const updatedTitle = {
      nb: "Updated Title",
      nn: "Oppdatert Tittel",
      en: "Updated Title",
    };
    await dataServiceEditPage.fillTitle(updatedTitle, [], false);

    // Save changes
    await dataServiceEditPage.clickSave();
    await dataServiceEditPage.expectSaveSuccessful();

    // Verify the changes were saved
    await dataServiceEditPage.expectTitleToBe(updatedTitle);

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin(
  "should show all form fields",
  async ({ page, playwright, accessibilityBuilder }) => {
    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);

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
  },
);

runTestAsAdmin(
  "should validate required fields",
  async ({ page, playwright, accessibilityBuilder }) => {
    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);

    await dataServiceEditPage.fillDescription({ nb: "Test Description" }, [
      "Bokmål",
    ]);
    // Try to save without filling required fields
    await dataServiceEditPage.clickSave();

    // Should show validation errors
    await expect(
      dataServiceEditPage.titleGroup.getByText(
        "Må fylles ut for minst ett språk.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Endepunkt må fylles ut.")).toBeVisible();
    await expect(
      dataServiceEditPage.contactNameGroup.getByText(
        "Må fylles ut for minst ett språk.",
      ),
    ).toBeVisible();
  },
);

runTestAsAdmin(
  "should handle form cancellation",
  async ({ page, playwright, accessibilityBuilder }) => {
    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);

    // Fill some data
    await dataServiceEditPage.fillTitle({ nb: "Test Title" }, ["Bokmål"]);

    // Click cancel
    await dataServiceEditPage.clickCancel();

    // Should redirect back to data services list
    await expect(page).toHaveURL(/\/catalogs\/.*\/data-services/);
  },
);

runTestAsAdmin(
  "should auto-save form data",
  async ({ page, playwright, accessibilityBuilder }) => {
    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);

    // Fill some data
    await dataServiceEditPage.fillTitle(
      { nb: "Auto Save Test" },
      ["Bokmål"],
      false,
    );
    await dataServiceEditPage.fillDescription(
      { nb: "Auto save description" },
      ["Bokmål"],
      false,
    );

    // Wait for auto-save to persist to localStorage
    await page.waitForFunction(
      () => {
        const data = localStorage.getItem("dataServiceForm");
        return data !== null;
      },
      { timeout: 5000 },
    );

    // Navigate away (stay within the same app to avoid cross-app redirect issues)
    await page.goto(`/catalogs/${process.env.E2E_CATALOG_ID}/data-services`);

    // Navigate back to new form
    await dataServiceEditPage.gotoNew(process.env.E2E_CATALOG_ID as string);
    await page.waitForLoadState("networkidle");

    // Should show restore dialog
    await expect(page.getByText("Vil du gjenopprette?")).toBeVisible();
  },
);

runTestAsAdmin(
  "empty submit check prevents save when only whitespace added",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // A valid data service, so a missing empty submit check would really result
    // in a save instead of being masked by a validation error
    const createdDataService = await createDataService(apiRequestContext, {
      ...getRandomDataService(),
      title: { nb: WHITESPACE_TITLE, nn: "", en: "" },
    });

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    await dataServiceEditPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );

    // Wait for form to be ready
    await dataServiceEditPage.expectSaveButtonVisible();
    await page.waitForLoadState("networkidle");

    // Add trailing whitespace to title
    await dataServiceEditPage.titleNbInput.fill(`${WHITESPACE_TITLE} `);

    // The form registered the edit. Without this the test could pass silently
    // because the input event was lost before hydration and nothing happened.
    await expect(dataServiceEditPage.saveButton).toBeEnabled();

    // Click save button
    await dataServiceEditPage.clickSave();

    // Wait for network to settle - if empty submit check works, no request is made
    await page.waitForLoadState("networkidle");

    // Verify NO snackbar appears (empty submit check should prevent save)
    await expect(dataServiceEditPage.successSnackbar).not.toBeVisible();
    await expect(dataServiceEditPage.errorSnackbar).not.toBeVisible();

    // The whitespace was normalized away and the form is pristine again
    await expect(dataServiceEditPage.titleNbInput).toHaveValue(
      WHITESPACE_TITLE,
    );
    await expect(dataServiceEditPage.saveButton).toBeDisabled();

    // The form was valid, so nothing was blocked by validation instead.
    // toHaveCount(0) rather than not.toBeVisible(), since the message can match
    // both the title group and the contact name group and trip strict mode.
    await expect(
      page.getByText("Må fylles ut for minst ett språk."),
    ).toHaveCount(0);
    await expect(page.getByText("Endepunkt må fylles ut.")).toHaveCount(0);

    // Re-add the whitespace and submit without blurring the input, so the
    // untrimmed value reaches onSubmit and the empty submit check itself runs
    // (a real click blurs the field, which trims it first)
    await dataServiceEditPage.titleNbInput.fill(`${WHITESPACE_TITLE} `);
    await expect(dataServiceEditPage.saveButton).toBeEnabled();
    await dataServiceEditPage.saveButton.dispatchEvent("click");
    await page.waitForLoadState("networkidle");

    await expect(dataServiceEditPage.successSnackbar).not.toBeVisible();
    await expect(dataServiceEditPage.errorSnackbar).not.toBeVisible();
    await expect(dataServiceEditPage.titleNbInput).toHaveValue(
      WHITESPACE_TITLE,
    );

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin(
  "should edit data service about section",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const originalDataService = getRandomDataService();
    const createdDataService = await createDataService(
      apiRequestContext,
      originalDataService,
    );

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    const dataServiceDetailPage = new DataServiceDetailPage(
      page,
      playwright,
      accessibilityBuilder,
    );

    // Navigate to the detail page and click edit
    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.clickEdit();
    await dataServiceEditPage.expectDataServiceEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );

    // Verify the existing values are prefilled
    await dataServiceEditPage.expectTitleToBe(originalDataService.title);
    await dataServiceEditPage.expectDescriptionToBe(
      originalDataService.description,
    );

    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };
    const newDescription = {
      nb: uniqueString("new_description_nb"),
      nn: uniqueString("new_description_nn"),
      en: uniqueString("new_description_en"),
    };
    const newVersion = "2.0.0";

    // All languages already have a value, so no language needs to be opened
    await dataServiceEditPage.fillTitle(newTitle, [], false);
    await dataServiceEditPage.fillDescription(newDescription, [], false);
    await dataServiceEditPage.fillVersion(newVersion);

    await dataServiceEditPage.clickSave();
    await dataServiceEditPage.expectSaveSuccessful();

    // Verify the changes were persisted
    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.expectTitleToBe(newTitle.nb);
    await dataServiceDetailPage.expectDescriptionToBe(newDescription.nb);
    await dataServiceDetailPage.expectVersionToBe(newVersion);

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin(
  "should edit data service endpoint section",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const createdDataService = await createDataService(
      apiRequestContext,
      getRandomDataService(),
    );

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    const dataServiceDetailPage = new DataServiceDetailPage(
      page,
      playwright,
      accessibilityBuilder,
    );

    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.clickEdit();

    const newEndpointUrl = "https://api.example.com/updated-endpoint";
    await dataServiceEditPage.fillEndpointUrl(newEndpointUrl);

    await dataServiceEditPage.clickSave();
    await dataServiceEditPage.expectSaveSuccessful();

    // Verify the change was persisted
    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.expectEndpointUrlToBe(newEndpointUrl);

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin(
  "should edit data service access section",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const createdDataService = await createDataService(
      apiRequestContext,
      getRandomDataService(),
    );

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    const dataServiceDetailPage = new DataServiceDetailPage(
      page,
      playwright,
      accessibilityBuilder,
    );

    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.clickEdit();

    // Access rights is a radio group backed by a static reference data list
    await dataServiceEditPage.selectAccessRights("Allmenn tilgang");

    await dataServiceEditPage.clickSave();
    await dataServiceEditPage.expectSaveSuccessful();

    // Verify the change was persisted
    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.expectAccessRightsToBe("Allmenn tilgang");

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);

runTestAsAdmin(
  "should edit data service contact point section",
  async ({ page, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const createdDataService = await createDataService(
      apiRequestContext,
      getRandomDataService(),
    );

    const dataServiceEditPage = new DataServiceEditPage(
      page,
      playwright,
      accessibilityBuilder,
    );
    const dataServiceDetailPage = new DataServiceDetailPage(
      page,
      playwright,
      accessibilityBuilder,
    );

    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.clickEdit();

    const newContactPoint = {
      email: "updated@example.com",
      phone: "+4787654321",
      url: "https://example.com/updated-contact",
    };
    await dataServiceEditPage.fillContactPoint(newContactPoint);

    await dataServiceEditPage.clickSave();
    await dataServiceEditPage.expectSaveSuccessful();

    // Verify the changes were persisted
    await dataServiceDetailPage.goto(
      process.env.E2E_CATALOG_ID as string,
      createdDataService.id,
    );
    await dataServiceDetailPage.expectContactEmailToBe(newContactPoint.email);
    await dataServiceDetailPage.expectContactPhoneToBe(newContactPoint.phone);
    await dataServiceDetailPage.expectContactUrlToBe(newContactPoint.url);

    // Clean up
    await deleteDataService(apiRequestContext, createdDataService.id);
  },
);
