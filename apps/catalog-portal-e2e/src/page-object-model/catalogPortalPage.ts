import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class CatalogPortalPage {
  url = "/catalogs";
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder?: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  datasetCatalog = () =>
    this.page.getByRole("link", { name: /^Datasettkatalog/ });
  dataServiceCatalog = () =>
    this.page.getByRole("link", { name: /^API-katalog/ });
  conceptCatalog = () =>
    this.page.getByRole("link", { name: /^Begrepskatalog/ });
  publicServiceCatalog = () =>
    this.page.getByRole("link", { name: /^Tjenestekatalog Offentlige/ });
  serviceCatalog = () =>
    this.page.getByRole("link", { name: /^Tjenestekatalog Tjenester/ });

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

  async verifyAndClickCatalogLink(
    locatorFunction: keyof CatalogPortalPage,
    expectedUrl: RegExp,
  ) {
    const locator = (this[locatorFunction] as any)();
    await expect(locator).toBeVisible();
    await expect(locator).toHaveAttribute("href", expectedUrl);
  }
}
