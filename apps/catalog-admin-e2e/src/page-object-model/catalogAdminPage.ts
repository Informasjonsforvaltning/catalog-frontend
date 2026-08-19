import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class CatalogAdminPage {
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  readonly catalogId = process.env.E2E_CATALOG_ID ?? "";

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  catalogPath(path = "") {
    return `/catalogs/${this.catalogId}${path}`;
  }

  async gotoHome() {
    await this.page.goto("/");
  }

  async gotoCatalog(path = "") {
    await this.page.goto(this.catalogPath(path));
  }

  // Without the organization admin role these pages redirect to /no-access
  async expectOnCatalogPath(path = "") {
    await expect(this.page).toHaveURL(this.catalogPath(path));
  }

  // exact: "Administrere katalog" is a substring of the no-access page's
  // "Administrere kataloger"
  async expectHeading(name: string) {
    await expect(
      this.page.getByRole("heading", { name, level: 1, exact: true }),
    ).toBeVisible();
  }

  async expectSectionHeading(name: string) {
    await expect(
      this.page.getByRole("heading", { name, level: 2, exact: true }),
    ).toBeVisible();
  }

  // By href, not by name: NavigationCard puts the card body inside the anchor,
  // and the bodies quote each other's titles
  async expectCardLink(path: string) {
    const link = this.page.locator(`a[href="${this.catalogPath(path)}"]`);
    await expect(link).toBeVisible();
  }

  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "target-size", "label-title-only"])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
