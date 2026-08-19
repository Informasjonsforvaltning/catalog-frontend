import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { Service } from "@catalog-frontend/types";
import { ServiceStatus } from "../utils/helpers";

export default class ServicesPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/services`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  statusFilterHeaderLocator = () =>
    this.page.getByRole("button", { name: "Tjenestestatus" });
  statusFilterCompletedLocator = () =>
    this.page.getByRole("checkbox", { name: "Ferdigstilt" });
  statusFilterDeprecatedLocator = () =>
    this.page.getByRole("checkbox", { name: "Frarådet" });
  statusFilterUnderDevelopmentLocator = () =>
    this.page.getByRole("checkbox", { name: "Under utvikling" });
  statusFilterWithdrawnLocator = () =>
    this.page.getByRole("checkbox", { name: "Trukket tilbake" });
  publishedStateFilterHeaderLocator = () =>
    this.page.getByRole("button", { name: "Publiseringstilstand" });
  publishedStateFilterPublishedLocator = () =>
    this.page.getByRole("checkbox", { name: "Publisert", exact: true });
  publishedStateFilterNotPublishedLocator = () =>
    this.page.getByRole("checkbox", { name: "Ikke publisert" });
  searchInputLocator = () =>
    this.page.getByPlaceholder("Søk etter tjeneste...");
  searchButtonLocator = () => this.page.getByRole("button", { name: "Søk" });

  public async goto() {
    await this.page.goto(this.url);
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

  // Filters are defaultOpen, clicking the header would collapse them.
  private async expandFilter(header: () => ReturnType<Page["getByRole"]>) {
    await expect(header()).toBeVisible();
    if ((await header().getAttribute("aria-expanded")) !== "true") {
      await header().click();
    }
  }

  public async expectFiltersToBeVisible() {
    await this.expandFilter(this.statusFilterHeaderLocator);
    await expect(this.statusFilterCompletedLocator()).toBeVisible();
    await expect(this.statusFilterDeprecatedLocator()).toBeVisible();
    await expect(this.statusFilterUnderDevelopmentLocator()).toBeVisible();
    await expect(this.statusFilterWithdrawnLocator()).toBeVisible();

    await this.expandFilter(this.publishedStateFilterHeaderLocator);
    await expect(this.publishedStateFilterPublishedLocator()).toBeVisible();
    await expect(this.publishedStateFilterNotPublishedLocator()).toBeVisible();
  }

  public async expectSearchResults(
    expected: Service[],
    notExpected: Service[] = [],
  ) {
    for (const service of expected) {
      const nbName = service.title.nb as string;
      // Expect to find the concept
      await expect(this.page.getByText(nbName, { exact: true })).toBeVisible({
        timeout: 5000,
      });
    }

    for (const service of notExpected) {
      const nbName = service.title.nb as string;
      // Expect not to find the concept
      await expect(this.page.getByText(nbName, { exact: true })).toHaveCount(0);
    }
  }

  public async search(query: string) {
    await this.searchInputLocator().fill(query);
    await this.searchButtonLocator().click();

    const spinner = this.page.getByRole("img", { name: "Laster" });
    // Wait for spinner to be visible and hidden
    await spinner.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
    await spinner.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
  }

  public async clearFilters() {
    await this.statusFilterCompletedLocator().uncheck();
    await this.statusFilterDeprecatedLocator().uncheck();
    await this.statusFilterUnderDevelopmentLocator().uncheck();
    await this.statusFilterWithdrawnLocator().uncheck();
    await this.publishedStateFilterPublishedLocator().uncheck();
    await this.publishedStateFilterNotPublishedLocator().uncheck();
  }

  public async filterStatus(status: ServiceStatus) {
    const statusMap: {
      [key in ServiceStatus]: () => ReturnType<Page["getByLabel"]>;
    } = {
      [ServiceStatus.COMPLETED]: this.statusFilterCompletedLocator,
      [ServiceStatus.DEPRECATED]: this.statusFilterDeprecatedLocator,
      [ServiceStatus.UNDER_DEVELOPMENT]:
        this.statusFilterUnderDevelopmentLocator,
      [ServiceStatus.WITHDRAWN]: this.statusFilterWithdrawnLocator,
    };

    const locatorFn = statusMap[status];
    if (!locatorFn) {
      throw new Error(`Unknown status: ${status}`);
    }

    if (!(await locatorFn().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await locatorFn().check();
  }

  public async filterPublished() {
    if (
      (await this.publishedStateFilterHeaderLocator().getAttribute(
        "aria-expanded",
      )) !== "true"
    ) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterPublishedLocator().check();
  }

  public async filterNotPublished() {
    if (
      (await this.publishedStateFilterHeaderLocator().getAttribute(
        "aria-expanded",
      )) !== "true"
    ) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterNotPublishedLocator().check();
  }
}
