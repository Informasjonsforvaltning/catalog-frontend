import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

// The service detail page carries no data-testid attributes, so assertions go
// through roles and text. Fixture values are built with uniqueString(), so a
// plain getByText stays unambiguous.
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

  // Substring matching on purpose: the heading also carries a status tag, and
  // values are unique strings so there is nothing else they could match
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
