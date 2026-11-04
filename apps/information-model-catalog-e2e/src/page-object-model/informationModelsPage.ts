import { expect, Locator, Page } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class InformationModelsPage {
  readonly page: Page;
  readonly accessibilityBuilder: AxeBuilder;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly informationModelCards: Locator;
  readonly createInformationModelButton: Locator;
  readonly publishedFilterHeader: Locator;
  readonly publishedFilterPublished: Locator;
  readonly publishedFilterNotPublished: Locator;

  constructor(page: Page, accessibilityBuilder: AxeBuilder) {
    this.page = page;
    this.accessibilityBuilder = accessibilityBuilder;
    this.searchInput = page.getByRole("searchbox", { name: "Søk" });
    this.searchButton = page.getByRole("button", { name: "Søk" });
    this.informationModelCards = page
      .getByRole("listitem")
      .filter({ has: page.locator('a[href*="/information-models/"]') });
    this.createInformationModelButton = page.getByRole("link", {
      name: "Legg til informasjonsmodellbeskrivelse",
    });
    this.publishedFilterHeader = page.getByRole("button", {
      name: "Publiseringstilstand",
      exact: true,
    });
    this.publishedFilterPublished = page.getByLabel("Publisert", {
      exact: true,
    });
    this.publishedFilterNotPublished = page.getByLabel("Ikke publisert", {
      exact: true,
    });
  }

  async goto(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/information-models`);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  private async expandFilter(header: Locator) {
    await expect(header).toHaveAttribute("aria-expanded", "false");
    await header.click();
    await expect(header).toHaveAttribute("aria-expanded", "true");
  }

  async expandPublishedFilter() {
    await this.expandFilter(this.publishedFilterHeader);
  }

  async filterPublished() {
    await this.publishedFilterPublished.check();
    await expect(this.publishedFilterPublished).toBeChecked();
  }

  async filterNotPublished() {
    await this.publishedFilterNotPublished.check();
    await expect(this.publishedFilterNotPublished).toBeChecked();
  }

  async clearPublishedFilter() {
    await this.publishedFilterPublished.uncheck();
    await this.publishedFilterNotPublished.uncheck();
    await expect(this.publishedFilterPublished).not.toBeChecked();
    await expect(this.publishedFilterNotPublished).not.toBeChecked();
  }

  async clickCreateInformationModel() {
    await this.createInformationModelButton.click();
  }

  getCardByTitle(title: string) {
    return this.informationModelCards.filter({
      has: this.page.getByRole("link", { name: title }),
    });
  }

  async openInformationModel(title: string) {
    await this.getCardByTitle(title).getByRole("link", { name: title }).click();
  }

  async expectInformationModelVisible(title: string) {
    await expect(this.getCardByTitle(title)).toHaveCount(1);
  }

  async expectInformationModelNotVisible(title: string) {
    await expect(this.getCardByTitle(title)).toHaveCount(0);
  }

  async expectCardToContainText(title: string, text: string) {
    await expect(this.getCardByTitle(title)).toContainText(text);
  }

  async checkAccessibility() {
    {
      const { default: Axe } = await import("@axe-core/playwright");
      const probe = await new Axe({ page: this.page })
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ])
        .analyze();
      console.log(
        "AXE_PROBE " +
          JSON.stringify(
            probe.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              help: v.help,
              nodes: v.nodes.map((n) => ({
                target: n.target,
                html: n.html.slice(0, 300),
                summary: n.failureSummary,
              })),
            })),
          ),
      );
    }
    // Designsystemet links each filter checkbox to its <label> on the client.
    // Until then the inputs only have a title, wait for them to be reachable by label before scanning.
    await expect(this.publishedFilterPublished).toBeAttached();
    await expect(this.publishedFilterNotPublished).toBeAttached();
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "aria-toggle-field-name", "target-size"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
}
