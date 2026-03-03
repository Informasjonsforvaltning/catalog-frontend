import {
  expect,
  Page,
  BrowserContext,
  APIRequestContext,
} from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { Concept } from "@catalog-frontend/types";
import DetailPage from "./detailPage";
import EditPage from "./editPage";
import { ConceptStatus } from "../utils/helpers";

export default class ConceptsPage {
  url: string;
  page: Page;
  detailPage: DetailPage;
  editPage: EditPage;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.detailPage = new DetailPage(page, context, accessibilityBuilder);
    this.editPage = new EditPage(page, context, accessibilityBuilder);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole("heading", { name: "" });
  pageDescriptionLocator = () => this.page.getByText("");
  subjectFilterHeaderLocator = () =>
    this.page.getByRole("button", { name: "Fagområde" });
  statusFilterHeaderLocator = () =>
    this.page.getByRole("button", { name: "Begrepsstatus" });
  statusFilterDraftLocator = () => this.page.getByLabel("Utkast");
  statusFilterCandidateLocator = () => this.page.getByLabel("Kandidat");
  statusFilterWaitingLocator = () => this.page.getByLabel("Til godkjenning");
  statusFilterCurrentLocator = () => this.page.getByLabel("Gjeldende");
  statusFilterRetiredLocator = () => this.page.getByLabel("Foreldet");
  statusFilterRejectedLocator = () => this.page.getByLabel("Avvist");
  publishedStateFilterHeaderLocator = () =>
    this.page.getByRole("button", { name: "Publiseringstilstand" });
  publishedStateFilterPublishedLocator = () =>
    this.page.getByLabel("Publisert", { exact: true });
  publishedStateFilterNotPublishedLocator = () =>
    this.page.getByLabel("Ikke publisert");
  searchInputLocator = () => this.page.getByPlaceholder("Søk");
  searchButtonLocator = () => this.page.getByRole("button", { name: "Søk" });
  noResultsLocator = () => this.page.getByText("Ditt søk ga ingen treff");

  async deletedAllConcepts() {
    try {
      await this.noResultsLocator().waitFor({
        state: "visible",
        timeout: 5000,
      });
      return await this.noResultsLocator().isVisible();
    } catch {
      return false;
    }
  }

  async deleteConcept(url: string) {
    await this.detailPage.goto(url);
    await this.detailPage.deleteConcept();
  }

  public async goto() {
    await this.page.goto(this.url);
    // Wait for page to be ready - the search input indicates the page has loaded
    await this.page
      .getByRole("searchbox", { name: "Søk" })
      .waitFor({ state: "visible" });
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules([
        "svg-img-alt",
        "aria-toggle-field-name",
        "target-size",
        "label-title-only",
      ])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }

  public async checkPageTitleText() {
    await expect(this.pageTitleLocator()).toHaveText("");
  }

  public async checkPageDescriptionText() {
    await expect(this.pageDescriptionLocator()).toHaveText("");
  }

  public async checkIfNoConceptsExist() {
    const items = (await this.page.getByRole("link").all()).filter(
      async (link) => {
        (await link.getAttribute("href"))?.startsWith(this.url);
      },
    );

    expect(items.length).toBe(0);
  }

  public async createConceptUsingForm(
    concept: Concept,
    apiRequestContext: APIRequestContext,
  ) {
    await this.goto();

    console.log(
      `Create new concept with title ${concept.anbefaltTerm?.navn.nb}`,
    );

    // Name and description
    await this.page
      .getByRole("link", { name: "Nytt begrep" })
      .click({ timeout: 10000 });
    await this.editPage.expectMenu();
    await this.editPage.fillFormAndSave(concept, apiRequestContext);
    await this.detailPage.expectDetails(concept, apiRequestContext);
  }

  public async expectFiltersToBeVisible() {
    await expect(this.statusFilterHeaderLocator()).toBeVisible();
    await expect(this.statusFilterCandidateLocator()).toBeVisible();
    await expect(this.statusFilterCurrentLocator()).toBeVisible();
    await expect(this.statusFilterDraftLocator()).toBeVisible();
    await expect(this.statusFilterRejectedLocator()).toBeVisible();
    await expect(this.statusFilterRetiredLocator()).toBeVisible();
    await expect(this.statusFilterWaitingLocator()).toBeVisible();
    await expect(this.publishedStateFilterHeaderLocator()).toBeVisible();
    await expect(this.publishedStateFilterPublishedLocator()).toBeVisible();
    await expect(this.publishedStateFilterNotPublishedLocator()).toBeVisible();
  }

  public async expectSearchResults(
    expected: Concept[],
    notExpected: Concept[] = [],
  ) {
    for (const concept of expected) {
      const nbName = concept.anbefaltTerm?.navn.nb as string;
      // Expect to find the concept
      await expect(this.page.getByText(nbName, { exact: true })).toBeVisible({
        timeout: 5000,
      });
    }

    for (const concept of notExpected) {
      const nbName = concept.anbefaltTerm?.navn.nb as string;
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

  public async clearSearch() {
    await this.searchInputLocator().fill("");
    await this.searchButtonLocator().click();
  }

  public async clearFilters() {
    await this.statusFilterDraftLocator().uncheck();
    await this.statusFilterCandidateLocator().uncheck();
    await this.statusFilterWaitingLocator().uncheck();
    await this.statusFilterCurrentLocator().uncheck();
    await this.statusFilterRetiredLocator().uncheck();
    await this.statusFilterRejectedLocator().uncheck();

    await this.publishedStateFilterPublishedLocator().uncheck();
    await this.publishedStateFilterNotPublishedLocator().uncheck();
  }

  public async filterStatus(status: ConceptStatus) {
    const statusMap: {
      [key in ConceptStatus]: () => ReturnType<Page["getByLabel"]>;
    } = {
      [ConceptStatus.DRAFT]: this.statusFilterDraftLocator,
      [ConceptStatus.CANDIDATE]: this.statusFilterCandidateLocator,
      [ConceptStatus.WAITING]: this.statusFilterWaitingLocator,
      [ConceptStatus.CURRENT]: this.statusFilterCurrentLocator,
      [ConceptStatus.RETIRED]: this.statusFilterRetiredLocator,
      [ConceptStatus.REJECTED]: this.statusFilterRejectedLocator,
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

  public async filterStatusDraft() {
    if (!(await this.statusFilterDraftLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterDraftLocator().check();
  }

  public async filterStatusCandidate() {
    if (!(await this.statusFilterCandidateLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterCandidateLocator().check();
  }

  public async filterStatusWaiting() {
    if (!(await this.statusFilterWaitingLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterWaitingLocator().check();
  }

  public async filterStatusRejected() {
    if (!(await this.statusFilterRejectedLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterRejectedLocator().check();
  }

  public async filterStatusRetired() {
    if (!(await this.statusFilterRetiredLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterRetiredLocator().check();
  }

  public async filterStatusCurrent() {
    if (!(await this.statusFilterCurrentLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterCurrentLocator().check();
  }

  public async filterPublished() {
    if (!(await this.publishedStateFilterPublishedLocator().isVisible())) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterPublishedLocator().check();
  }

  public async filterNotPublished() {
    if (!(await this.publishedStateFilterNotPublishedLocator().isVisible())) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterNotPublishedLocator().check();
  }

  public async hideDevtools() {
    if (
      await this.page
        .getByRole("button", { name: "Open Next.js Dev Tools" })
        .isVisible()
    ) {
      await this.page
        .getByRole("button", { name: "Open Next.js Dev Tools" })
        .click();
      await this.page.getByText("Preferences").click();
      await this.page.getByRole("button", { name: "Hide" }).click();
      await this.page
        .getByRole("button", { name: "Open Next.js Dev Tools" })
        .waitFor({ state: "hidden", timeout: 5000 });
    }
  }
}
