import { expect, Page, BrowserContext } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";

export default class DatasetDetailPage {
  protected page: Page;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  async goto(catalogId: string, datasetId: string) {
    await this.page.goto(`/catalogs/${catalogId}/datasets/${datasetId}`);
  }

  async expectTitle(title: string) {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async expectDescription(description: string) {
    await expect(this.page.getByText(description)).toBeVisible();
  }

  async expectStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }

  async expectPublicationStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }

  async expectContactPoint(email: string, phone: string, url: string) {
    await expect(this.page.getByText(email)).toBeVisible();
    await expect(this.page.getByText(phone)).toBeVisible();
    await expect(this.page.getByRole("link", { name: url })).toBeVisible();
  }

  async expectDatasetId(id: string) {
    await expect(this.page.getByText(id)).toBeVisible();
  }

  async expectLanguageSelector() {
    await expect(
      this.page.getByRole("combobox", { name: "Velg språk" }),
    ).toBeVisible();
  }

  async expectEditButton() {
    await expect(
      this.page.getByRole("link", { name: "Rediger" }),
    ).toBeVisible();
  }

  async expectDeleteButton() {
    await expect(
      this.page.getByRole("button", { name: "Søppelikon Slett" }),
    ).toBeVisible();
  }

  async clickDeleteButton() {
    await this.page.getByRole("button", { name: "Søppelikon Slett" }).click();
  }

  async expectDeleteConfirmationDialog(datasetTitle: string) {
    await expect(this.page.getByRole("dialog")).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Slett datasett" }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        `Du er i ferd med å slette datasettbeskrivelsen ${datasetTitle}. All data knyttet til datasettbeskrivelsen vil bli permanent slettet, og slettingen kan ikke angres. Er du sikker på at du vil fortsette?`,
      ),
    ).toBeVisible();
  }

  async confirmDelete() {
    await this.page.getByRole("button", { name: "Slett", exact: true }).click();
  }

  async cancelDelete() {
    await this.page.getByRole("button", { name: "Avbryt" }).click();
  }

  async expectPublishSwitch() {
    await expect(
      this.page.getByRole("checkbox", { name: "Publisert" }),
    ).toBeVisible();
  }

  async expectHelpButton(label: string) {
    await expect(
      this.page.getByRole("button", { name: `Hjelpetekst ${label}` }),
    ).toBeVisible();
  }

  async expectSectionHeading(heading: string) {
    await expect(
      this.page.getByRole("heading", { name: heading }),
    ).toBeVisible();
  }

  async clickEditButton() {
    await this.page.getByRole("link", { name: "Rediger" }).click();
  }

  // New methods for verifying dataset details
  async expectAccessRights(value: string) {
    await expect(this.page.getByText(value)).toBeVisible();
  }

  async expectLegalRestriction(value: string) {
    await expect(this.page.getByText(value)).toBeVisible();
  }

  async expectLegalProcessing(value: string) {
    await expect(this.page.getByText(value)).toBeVisible();
  }

  async expectLegalAccess(value: string) {
    await expect(this.page.getByText(value)).toBeVisible();
  }

  async expectPublicationDate(date: string) {
    const label = this.page.getByRole("heading", { name: "Utgivelsesdato" });
    await expect(label).toBeVisible();
    // Convert YYYY-MM-DD to DD.MM.YYYY
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}.${month}.${year}`;
    await expect(this.page.getByText(formattedDate)).toBeVisible();
  }

  // Theme section
  async expectEuDataTheme(theme: string) {
    const label = this.page.getByRole("heading", { name: "Datatema" });
    await expect(label).toBeVisible();
    await expect(this.page.getByText(theme, { exact: true })).toBeVisible();
  }

  async expectLosTheme(theme: string) {
    const label = this.page.getByRole("heading", { name: "LOS-tema" });
    await expect(label).toBeVisible();
    await expect(this.page.getByText(theme, { exact: true })).toBeVisible();
  }

  // Distribution section
  async expectDistributionTitle(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectDistributionDescription(description: string) {
    await expect(this.page.getByText(description)).toBeVisible();
  }

  async expectDistributionAccessUrl(url: string) {
    await expect(this.page.getByRole("link", { name: url })).toBeVisible();
  }

  async expectDistributionLicense(license: string) {
    await expect(this.page.getByText(license).first()).toBeVisible();
  }

  async expectDistributionFormat(format: string) {
    const label = this.page.getByRole("heading", { name: "Format" });
    await expect(label).toBeVisible();
    await expect(this.page.getByText(format, { exact: true })).toBeVisible();
  }

  // Details section
  async expectLandingPage(url: string) {
    await expect(this.page.getByRole("link", { name: url })).toBeVisible();
  }

  async expectLanguages(languages: string[]) {
    await expect(this.page.getByText(languages.join(", "))).toBeVisible();
  }

  async expectCoverageArea(area: string) {
    await expect(this.page.getByText(area)).toBeVisible();
  }

  async expectPeriod(from: string, to: string) {
    await expect(this.page.getByText(from)).toBeVisible();
    await expect(this.page.getByText(to)).toBeVisible();
  }

  async expectDatasetType(type: string) {
    await expect(this.page.getByText(type)).toBeVisible();
  }

  async expectProvenance(provenance: string) {
    await expect(this.page.getByText(provenance)).toBeVisible();
  }

  async expectFrequency(frequency: string) {
    await expect(this.page.getByText(frequency)).toBeVisible();
  }

  // Relations section
  async expectRelatedResourceTitle(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectRelatedResourceUri(uri: string) {
    await expect(this.page.getByRole("link", { name: uri })).toBeVisible();
  }

  async expectRelationTitle(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectRelationType(type: string) {
    await expect(this.page.getByText(type)).toBeVisible();
  }

  // Concept section
  async expectConceptTitle(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectConceptUri(uri: string) {
    await expect(this.page.getByRole("link", { name: uri })).toBeVisible();
  }

  async expectKeywords(keywords: string[]) {
    for (const keyword of keywords) {
      await expect(this.page.getByText(keyword, { exact: true })).toBeVisible();
    }
  }

  // Information Model section
  async expectInformationModelTitle(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectInformationModelUri(uri: string) {
    await expect(this.page.getByRole("link", { name: uri })).toBeVisible();
  }

  // Contact Point section
  async expectContactPointEmail(email: string) {
    await expect(this.page.getByText(email)).toBeVisible();
  }

  async expectContactPointPhone(phone: string) {
    await expect(this.page.getByText(phone)).toBeVisible();
  }

  async expectContactPointUrl(url: string) {
    await expect(this.page.getByRole("link", { name: url })).toBeVisible();
  }
}
