import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export type CatalogLinkName =
  | "datasetCatalog"
  | "dataServiceCatalog"
  | "conceptCatalog"
  | "publicServiceCatalog"
  | "serviceCatalog";

export default class CatalogPortalPage {
  // Catalog id is required, /catalogs only works via single-org redirect.
  url = `/catalogs/${process.env.E2E_CATALOG_ID}`;
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

  // Anchor required, both service cards share the title "Tjenestekatalog".
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

  private catalogLink(name: CatalogLinkName): Locator {
    const links: Record<CatalogLinkName, () => Locator> = {
      datasetCatalog: this.datasetCatalog,
      dataServiceCatalog: this.dataServiceCatalog,
      conceptCatalog: this.conceptCatalog,
      publicServiceCatalog: this.publicServiceCatalog,
      serviceCatalog: this.serviceCatalog,
    };
    return links[name]();
  }

  async expectCatalogLink(name: CatalogLinkName, expectedUrl: string) {
    const locator = this.catalogLink(name);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveAttribute("href", expectedUrl);
  }
}
