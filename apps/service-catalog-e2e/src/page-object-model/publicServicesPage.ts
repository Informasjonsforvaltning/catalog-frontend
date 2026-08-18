import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

// No spec uses this page object yet: /public-services is still uncovered. It is
// kept minimal on purpose. The previous version carried dead helpers that were
// broken if ever called (getByText("") locators, a delete loop with no wait
// inside while(true), and a createPublicServices() that only logged), so they
// were removed rather than left as scaffolding to copy from.
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

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder.analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
