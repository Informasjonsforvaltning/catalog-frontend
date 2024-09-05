import { expect, Page, BrowserContext, Locator } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';

export default class CatalogPortalPage {
  url = '/catalogs';
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  datasetCatalog = () => this.page.getByRole('link', { name: 'Files icon Datasettkatalog 0' });
  dataServiceCatalog = () => this.page.getByRole('link', { name: 'Code icon Datatjenestekatalog' });
  conceptCatalog = () => this.page.getByRole('link', { name: 'Elipsis icon Begrepskatalog 2' });
  publicServiceCatalog = () => this.page.getByRole('link', { name: 'Compass icon Offentlig' });
  serviceCatalog = () => this.page.getByRole('link', { name: 'Compass icon Tjenestekatalog' });
  recordsOfProcessingActivities = () => this.page.getByRole('link', { name: 'Gavel Sound Block Icon' });

  termsOfUse = () => this.page.getByRole('main').getByRole('link', { name: 'Bruksvilkår' });

  public async goto(url: string = this.url) {
    await this.page.goto(url);
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder.analyze();
    expect.soft(result.violations).toEqual([]);
  }

  async verifyAndClickCatalogLink(locatorFunction: keyof CatalogPortalPage, expectedUrl: RegExp) {
    const locator = this[locatorFunction]();
    await expect(locator).toBeVisible();
    await locator.click();
    await expect(this.page).toHaveURL(expectedUrl);
  }
}
