import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class CatalogPortalPage {
  url = "/catalogs";
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
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
    // Firefox is markedly slower to receive the streamed SSR output for the
    // catalog navigation cards; wait for the network to settle so the links
    // are present before assertions run.
    await this.page.waitForLoadState("networkidle");
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
    const locator = (this[locatorFunction] as () => Locator)();
    // Allow extra time: the nav-card links are streamed in and render later on
    // Firefox than the 5s default assertion timeout.
    await expect(locator).toBeVisible({ timeout: 30000 });
    await expect(locator).toHaveAttribute("href", expectedUrl);
  }
}
