import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class ServiceDetailPage {
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  readonly editLink: Locator;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
    this.editLink = page.getByRole("link", { name: "Rediger tjeneste" });
  }

  async goto(catalogId: string, serviceId: string) {
    await this.page.goto(`/catalogs/${catalogId}/services/${serviceId}`);
    await this.page.waitForLoadState("networkidle");
  }

  async clickEdit() {
    await this.editLink.click();
  }

  async expectHeading(title: string) {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async expectText(value: string) {
    await expect(this.page.getByText(value)).toBeVisible();
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
