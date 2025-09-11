import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { deleteAllImportResults } from '../utils/helpers';

export default class ImportResultsPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  public getByLabelLocator = (label: string) => this.page.getByLabel(label);

  // Locators
  statusFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Status' });
  statusFilterSuccessfulLocator = () => this.getByLabelLocator('Vellykket');
  statusFilterFailedLocator = () => this.getByLabelLocator('Feilet');
  statusFilterOngoingLocator = () => this.getByLabelLocator('Pågår');
  statusFilterCancelledLocator = () => this.getByLabelLocator('Avvist');
  statusFilterPendingConfirmationLocator = () => this.getByLabelLocator('Venter på bekreftelse');

  async expectFiltersToBeInvisible() {
    await expect(this.statusFilterSuccessfulLocator()).not.toBeVisible();
    await expect(this.statusFilterFailedLocator()).not.toBeVisible();
    await expect(this.statusFilterOngoingLocator()).not.toBeVisible();
    await expect(this.statusFilterCancelledLocator()).not.toBeVisible();
    await expect(this.statusFilterPendingConfirmationLocator()).not.toBeVisible();
  }

  async expectFiltersToBeVisible() {
    await expect(this.statusFilterHeaderLocator()).toBeVisible();
    await expect(this.statusFilterSuccessfulLocator()).toBeVisible();
    await expect(this.statusFilterFailedLocator()).toBeVisible();
    await expect(this.statusFilterOngoingLocator()).toBeVisible();
    await expect(this.statusFilterCancelledLocator()).toBeVisible();
    await expect(this.statusFilterPendingConfirmationLocator()).toBeVisible();
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      console.log('[IMPORT RESULTS PAGE] Accessibility builder not available, skipping accessibility check.');
      return;
    }
    console.log('[IMPORT RESULTS PAGE] Running accessibility check...');
    const result = await this.accessibilityBuilder.analyze();
    expect.soft(result.violations).toEqual([]);
    console.log('[IMPORT RESULTS PAGE] Accessibility check complete. Violations:', result.violations.length);
  }

  async expectImportResultUrl() {
    await this.page.waitForURL(`/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`);
  }

  async deleteAllImportResults(apiRequestContext) {
    await deleteAllImportResults(apiRequestContext);
  }
}
