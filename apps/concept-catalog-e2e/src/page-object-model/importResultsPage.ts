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
  statusFilterSuccessfulLocator = () => this.getByLabelLocator('Lagt til i katalog');
  statusFilterSavingLocator = () => this.getByLabelLocator('Legging til i katalog');
  statusFilterFailedLocator = () => this.getByLabelLocator('Feilet');
  statusFilterOngoingLocator = () => this.getByLabelLocator('Pågår');
  statusFilterCancelledLocator = () => this.getByLabelLocator('Avvist');
  statusFilterPendingConfirmationLocator = () => this.getByLabelLocator('Til gjennomgang');

  async expectFiltersToBeInvisible() {
    console.log('[Test] Expecting \'Lagt til i katalog\' filter to be invisible...');
    await expect(this.statusFilterSuccessfulLocator()).not.toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Legging til i katalog\' filter to be invisible...');
    await expect(this.statusFilterSavingLocator()).not.toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Feilet\' filter to be invisible...');
    await expect(this.statusFilterFailedLocator()).not.toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Pågår\' filter to be invisible...');
    await expect(this.statusFilterOngoingLocator()).not.toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Avvist\' filter to be invisible...');
    await expect(this.statusFilterCancelledLocator()).not.toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Til gjennomgang\' filter to be invisible...');
    await expect(this.statusFilterPendingConfirmationLocator()).not.toBeVisible({timeout: 20000});
  }

  async expectFiltersToBeVisible() {
    console.log('[Test] Expecting \'Status\' filter to be visible...');
    await expect(this.statusFilterHeaderLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Lagt til i katalog\' filter to be visible...');
    await expect(this.statusFilterSuccessfulLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Legging til i katalog\' filter to be visible...');
    await expect(this.statusFilterSavingLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Feilet\' filter to be visible...');
    await expect(this.statusFilterFailedLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Pågår\' filter to be visible...');
    await expect(this.statusFilterOngoingLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Avvist\' filter to be visible...');
    await expect(this.statusFilterCancelledLocator()).toBeVisible({timeout: 20000});

    console.log('[Test] Expecting \'Til gjennomgang\' filter to be visible...');
    await expect(this.statusFilterPendingConfirmationLocator()).toBeVisible({timeout: 20000});
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
