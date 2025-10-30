import { expect, Page, BrowserContext, Locator } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import DatasetDetailPage from './datasetDetailPage';
import EditPage from './datasetEditPage';

export default class DatasetsPage {
  protected page: Page;
  protected detailPage: DatasetDetailPage;
  protected editPage: EditPage;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly datasetCards: Locator;
  readonly createDatasetButton: Locator;
  readonly statusFilterHeader: Locator;
  readonly statusFilterDraft: Locator;
  readonly statusFilterApproved: Locator;
  readonly publishedFilterHeader: Locator;
  readonly publishedFilterPublished: Locator;
  readonly publishedFilterNotPublished: Locator;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.page = page;
    this.detailPage = new DatasetDetailPage(page, context);
    this.editPage = new EditPage(page, context);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
    this.searchInput = page.getByRole('searchbox', { name: 'Søk' });
    this.searchButton = page.getByRole('button', { name: 'Søk' });
    this.datasetCards = page.locator('ul[role="list"]:not(nav ul) li[role="listitem"]');
    this.createDatasetButton = page.getByRole('link', { name: 'Legg til datasett' });
    this.statusFilterHeader = page.getByRole('button', { name: 'Status' });
    this.statusFilterDraft = page.getByLabel('Utkast');
    this.statusFilterApproved = page.getByLabel('Godkjent');
    this.publishedFilterHeader = page.getByRole('button', { name: 'Publiseringstilstand' });
    this.publishedFilterPublished = page.getByLabel('Publisert', { exact: true });
    this.publishedFilterNotPublished = page.getByLabel('Ikke publisert');
  }

  noResultsLocator = () => this.page.getByText('Ditt søk ga ingen treff');

  // Navigation
  async goto(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/datasets`);
  }

  // Actions
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();

    const spinner = this.page.getByRole('img', { name: 'Laster' });
    // Wait for spinner to be visible and hidden
    await spinner.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    await spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async clickCreateDataset() {
    await this.createDatasetButton.click();
  }

  async clickDatasetByTitle(title: string) {
    const card = await this.getDatasetCardByTitle(title);
    await card.getByRole('link', { name: title }).click();
  }

  async getDatasetCardByTitle(title: string) {
    return this.datasetCards.filter({ has: this.page.getByRole('link', { name: title }) });
  }

  async getDatasetStatus(title: string) {
    const card = await this.getDatasetCardByTitle(title);
    return card.locator('[role="status"]').textContent();
  }

  async verifyDatasetText(title: string, text: string) {
    const card = await this.getDatasetCardByTitle(title);
    return expect(card).toContainText(text);
  }

  async verifyDatasetExists(title: string) {
    await expect(await this.getDatasetCardByTitle(title)).toBeVisible();
  }

  async verifyDatasetDoesNotExist(title: string) {
    await expect(await this.getDatasetCardByTitle(title)).not.toBeVisible();
  }

  // Assertions
  async expectHasDatasets() {
    const cards = await this.datasetCards.count();
    // Subtract 1 for the header row
    expect(cards).toBeGreaterThan(0);
  }

  async expectDatasetCount(count: number) {
    const cards = await this.datasetCards.count();
    // Subtract 1 for the header row
    expect(cards).toBe(count);
  }

  async expectNoResults() {
    await this.noResultsLocator().waitFor({ state: 'visible' });
  }

  async expectDatasetDetailPageUrl(catalogId: string, datasetId: string) {
    await expect(this.page).toHaveURL(`/catalogs/${catalogId}/datasets/${datasetId}`);
  }

  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async expectCreateDatasetButtonVisible() {
    await expect(this.createDatasetButton).toBeVisible();
  }

  async expectStatusFilterVisible() {
    await expect(this.statusFilterHeader).toBeVisible();
    await expect(this.statusFilterDraft).toBeVisible();
    await expect(this.statusFilterApproved).toBeVisible();
  }

  async expectPublishedFilterVisible() {
    await expect(this.publishedFilterHeader).toBeVisible();
    await expect(this.publishedFilterPublished).toBeVisible();
    await expect(this.publishedFilterNotPublished).toBeVisible();
  }

  async expectAllFiltersVisible() {
    await this.expectStatusFilterVisible();
    await this.expectPublishedFilterVisible();
  }

  // Accessibility
  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(['svg-img-alt', 'aria-toggle-field-name', 'target-size'])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
