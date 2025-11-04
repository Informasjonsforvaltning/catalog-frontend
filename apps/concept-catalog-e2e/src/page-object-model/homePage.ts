import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class HomePage {
  url = "/";
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

  // Helpers
  public async goto(url: string = this.url) {
    console.log("[HOME PAGE] Navigating to:", url);
    await this.page.goto(url);
    console.log("[HOME PAGE] Navigation complete.");
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      console.log(
        "[HOME PAGE] Accessibility builder not available, skipping accessibility check.",
      );
      return;
    }
    console.log("[HOME PAGE] Running accessibility check...");
    const result = await this.accessibilityBuilder.analyze();
    expect.soft(result.violations).toEqual([]);
    console.log(
      "[HOME PAGE] Accessibility check complete. Violations:",
      result.violations.length,
    );
  }

  public async checkIfRedirectedToRegistrationPortal() {
    console.log(
      "[HOME PAGE] Waiting for possible redirect to registration portal...",
    );
    await this.page.waitForTimeout(5000);
    await this.page.waitForURL(/.*catalog-portal/);
    console.log("[HOME PAGE] Redirected to registration portal.");
  }
}
