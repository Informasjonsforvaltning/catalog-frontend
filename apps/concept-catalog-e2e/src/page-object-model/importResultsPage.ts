import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { deleteAllImportResults } from "../utils/helpers";
import { localization } from "@catalog-frontend/utils";

export default class ImportResultsPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder?: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  public getByLabelLocator = (label: string) =>
    this.page.getByLabel(new RegExp(`^${label}$`));

  // Locators
  statusFilterHeaderLocator = () =>
    this.page
      .locator(".fds-accordion__button")
      .filter({ hasText: `${localization.status}` });
  statusFilterSuccessfulLocator = () =>
    this.getByLabelLocator(`${localization.importResult.completed}`);
  statusFilterPartiallyCompletedLocator = () =>
    this.getByLabelLocator(`${localization.importResult.partiallyCompleted}`);
  statusFilterFailedLocator = () =>
    this.getByLabelLocator(`${localization.importResult.failed}`);
  statusFilterOngoingLocator = () =>
    this.getByLabelLocator(`${localization.importResult.inProgress}`);
  statusFilterCancelledLocator = () =>
    this.getByLabelLocator(`${localization.importResult.cancelled}`);
  statusFilterPendingConfirmationLocator = () =>
    this.getByLabelLocator(`${localization.importResult.pendingConfirmation}`);

  async expectFiltersToBeInvisible() {
    console.log(
      "[Test] Expecting '" +
        localization.importResult.completed +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterSuccessfulLocator()).not.toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.failed +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterFailedLocator()).not.toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.inProgress +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterOngoingLocator()).not.toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.cancelled +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterCancelledLocator()).not.toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.pendingConfirmation +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterPendingConfirmationLocator()).not.toBeVisible(
      { timeout: 20000 },
    );

    console.log(
      "[Test] Expecting '" +
        localization.importResult.partiallyCompleted +
        "' filter to be invisible...",
    );
    await expect(this.statusFilterPartiallyCompletedLocator()).not.toBeVisible({
      timeout: 20000,
    });
  }

  async expectFiltersToBeVisible() {
    console.log("[Test] Expecting 'Status' filter to be visible...");
    await expect(this.statusFilterHeaderLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.completed +
        "' filter to be visible...",
    );
    await expect(this.statusFilterSuccessfulLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.failed +
        "' filter to be visible...",
    );
    await expect(this.statusFilterFailedLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.inProgress +
        "' filter to be visible...",
    );
    await expect(this.statusFilterOngoingLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.cancelled +
        "' filter to be visible...",
    );
    await expect(this.statusFilterCancelledLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.pendingConfirmation +
        "' filter to be visible...",
    );
    await expect(this.statusFilterPendingConfirmationLocator()).toBeVisible({
      timeout: 20000,
    });

    console.log(
      "[Test] Expecting '" +
        localization.importResult.partiallyCompleted +
        "' filter to be visible...",
    );
    await expect(this.statusFilterPartiallyCompletedLocator()).toBeVisible({
      timeout: 20000,
    });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      console.log(
        "[IMPORT RESULTS PAGE] Accessibility builder not available, skipping accessibility check.",
      );
      return;
    }

    console.log("[IMPORT RESULTS PAGE] Running accessibility check...");
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "aria-toggle-field-name", "target-size"])
      .analyze();

    expect.soft(result.violations).toEqual([]);

    console.log(
      "[IMPORT RESULTS PAGE] Accessibility check complete. Violations:",
      result.violations,
    );
  }

  async expectImportResultUrl() {
    await expect(this.page).toHaveURL(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`,
      {
        timeout: 20000,
      },
    );
  }

  async deleteAllImportResults(apiRequestContext) {
    await deleteAllImportResults(apiRequestContext);
  }
}
