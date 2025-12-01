import { runTestAsAdmin } from "../../fixtures/basePage";
import { adminAuthFile } from "../../utils/helpers";
import { expect } from "@playwright/test";
import { localization } from "@catalog-frontend/utils";

runTestAsAdmin(
  "test import results page renders correctly",
  async ({ importResultsPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    console.log("[TEST] Navigating to ImportResults page...");
    await importResultsPage.goto();

    console.log("[TEST] Navigated to ImportResults page...");

    console.log("[TEST] Expecting URLs to be visible...");
    await importResultsPage.expectImportResultUrl();
    console.log("[TEST] URLs to are visible...");

    console.log("[TEST] Expecting filters to be visible by default...");
    await importResultsPage.expectFiltersToBeVisible();
    console.log("[TEST] Filters are invisible by default...");
  },
);

runTestAsAdmin(
  "Test going to Import results page when clicking on Results button in the import modal",
  async ({ conceptsPage, playwright }) => {
    // Admin Access user
    console.log("[TEST] Creating API request context for Admin user...");
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    await conceptsPage.goto();

    // Click the Import button
    console.log("[TEST] Clicking on import button...");
    await conceptsPage.page
      .getByRole("button", { name: `${localization.importResult.import}` })
      .click();

    const dialog = conceptsPage.page.getByRole("dialog", {
      has: conceptsPage.page.getByRole("button", {
        name: `${localization.importResult.results}`,
        exact: true,
      }),
    });

    // click the Import results button
    console.log("[TEST] Clicking on results button...");
    await dialog
      .getByRole("button", {
        name: `${localization.importResult.results}`,
        exact: true,
      })
      .click({ timeout: 100000 });

    // Wait for navigation to complete
    console.log("[TEST] Test Navigation to importResults...");
    await expect(conceptsPage.page).toHaveURL(
      conceptsPage.importResultsPage.url,
      { timeout: 100000 },
    );
  },
);
