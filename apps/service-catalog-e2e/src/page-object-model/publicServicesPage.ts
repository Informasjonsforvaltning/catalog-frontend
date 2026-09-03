import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class PublicServicesPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/public-services`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  public async goto() {
    await this.page.goto(this.url);
  }

  searchInput = () =>
    this.page.getByPlaceholder("Søk etter offentlig tjeneste...");

  createLink = () =>
    this.page.getByRole("link", { name: "Opprett ny offentlig tjeneste" });

  publishSwitch = () => this.page.getByRole("switch", { name: "Publisert" });

  deleteButton = () => this.page.getByRole("button", { name: "Slett" });

  async gotoDetail(serviceId: string) {
    await this.page.goto(`${this.url}/${serviceId}`);
  }

  async search(query: string) {
    await this.searchInput().fill(query);
    await this.page.getByRole("button", { name: "Søk" }).click();
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "target-size", "label-title-only"])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
