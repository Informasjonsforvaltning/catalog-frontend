import { expect, Page, BrowserContext, Locator } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import DataServiceDetailPage from './dataServiceDetailPage';
import EditPage from './dataServiceEditPage';

export default class DataServicesPage {
  protected page: Page;
  protected detailPage: DataServiceDetailPage;
  protected editPage: EditPage;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly dataServiceCards: Locator;
  readonly createDataServiceButton: Locator;
  readonly statusFilterHeader: Locator;
  readonly statusFilterFerdigstilt: Locator;
  readonly statusFilterFrarådet: Locator;
  readonly statusFilterUnderUtvikling: Locator;
  readonly statusFilterTrukketTilbake: Locator;
  readonly publishedFilterHeader: Locator;
  readonly publishedFilterPublished: Locator;
  readonly publishedFilterNotPublished: Locator;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.page = page;
    this.detailPage = new DataServiceDetailPage(page, context);
    this.editPage = new EditPage(page, context);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
    this.searchInput = page.getByRole('searchbox', { name: 'Søk' });
    this.searchButton = page.getByRole('button', { name: 'Søk' });
    this.dataServiceCards = page.locator('ul[role="list"]:not(nav ul) li[role="listitem"]');
    this.createDataServiceButton = page.getByRole('link', { name: 'Legg til API-beskrivelse' });
    this.statusFilterHeader = page.getByRole('button', { name: 'Status' });
    this.statusFilterFerdigstilt = page.getByLabel('Ferdigstilt');
    this.statusFilterFrarådet = page.getByLabel('Frarådet');
    this.statusFilterUnderUtvikling = page.getByLabel('Under utvikling');
    this.statusFilterTrukketTilbake = page.getByLabel('Trukket tilbake');
    this.publishedFilterHeader = page.getByRole('button', { name: 'Publiseringstilstand' });
    this.publishedFilterPublished = page.getByLabel('Publisert', { exact: true });
    this.publishedFilterNotPublished = page.getByLabel('Ikke publisert');
  }

  noResultsLocator = () => this.page.getByText('Ditt søk ga ingen treff');

  // Navigation
  async goto(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/data-services`);
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

  async clearFilters() {
    // Find and click all filter pills to remove them
    const filterChips = this.page.locator('[role="button"]').filter({ hasText: /Fjern filter/ });
    const chipCount = await filterChips.count();

    for (let i = 0; i < chipCount; i++) {
      // Click the first pill each time since the list will update after each removal
      const firstChip = filterChips.first();
      if (await firstChip.isVisible()) {
        await firstChip.click();
        // Wait a moment for the pill to be removed
        await this.page.waitForTimeout(500);
      }
    }
  }

  async clickCreateDataService() {
    await this.createDataServiceButton.click();
  }

  async clickDataServiceByTitle(title: string) {
    const card = await this.getDataServiceCardByTitle(title);
    await card.getByRole('link', { name: title }).click();
  }

  async getDataServiceCardByTitle(title: string) {
    return this.dataServiceCards.filter({ has: this.page.getByRole('link', { name: title }) });
  }

  async getDataServiceStatus(title: string) {
    const card = await this.getDataServiceCardByTitle(title);
    return card.locator('[role="status"]').textContent();
  }

  async verifyDataServiceText(title: string, text: string) {
    const card = await this.getDataServiceCardByTitle(title);
    return expect(card).toContainText(text);
  }

  async verifyDataServiceExists(title: string) {
    await expect(await this.getDataServiceCardByTitle(title)).toBeVisible();
  }

  async verifyDataServiceDoesNotExist(title: string) {
    await expect(await this.getDataServiceCardByTitle(title)).not.toBeVisible();
  }

  // Assertions
  async expectHasDataServices() {
    const cards = await this.dataServiceCards.count();
    // Subtract 1 for the header row
    expect(cards).toBeGreaterThan(0);
  }

  async expectDataServiceCount(count: number) {
    const cards = await this.dataServiceCards.count();
    // Subtract 1 for the header row
    expect(cards).toBe(count);
  }

  async expectNoResults() {
    await this.noResultsLocator().waitFor({ state: 'visible' });
  }

  async expectDataServiceDetailPageUrl(catalogId: string, dataServiceId: string) {
    await expect(this.page).toHaveURL(`/catalogs/${catalogId}/data-services/${dataServiceId}`);
  }

  async expectSearchInputVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async expectCreateDataServiceButtonVisible() {
    await expect(this.createDataServiceButton).toBeVisible();
  }

  async expectStatusFilterVisible() {
    await expect(this.statusFilterHeader).toBeVisible();
    await expect(this.statusFilterFerdigstilt).toBeVisible();
    await expect(this.statusFilterFrarådet).toBeVisible();
    await expect(this.statusFilterUnderUtvikling).toBeVisible();
    await expect(this.statusFilterTrukketTilbake).toBeVisible();
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
