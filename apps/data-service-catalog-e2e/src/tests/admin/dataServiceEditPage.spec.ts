import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import DataServiceEditPage from "../../page-object-model/dataServiceEditPage";
import {
  adminAuthFile,
  createDataService,
  deleteDataService,
} from "../../utils/helpers";
import {
  getRandomDataService,
  getMinimalDataService,
} from "../../utils/dataService";

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

    // Create a data service first
    const originalDataService = getMinimalDataService();
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
