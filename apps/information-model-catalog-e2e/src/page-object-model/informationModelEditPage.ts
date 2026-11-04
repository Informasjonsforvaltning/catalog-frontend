import { expect, Locator, Page } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { Language, TextByLanguage } from "../utils/informationModel";

const languages: Language[] = ["nb", "nn", "en"];

const languageLabels: Record<Language, string> = {
  nb: "Bokmål",
  nn: "Nynorsk",
  en: "Engelsk",
};

export default class InformationModelEditPage {
  readonly page: Page;
  readonly accessibilityBuilder: AxeBuilder;
  readonly titleGroup: Locator;
  readonly descriptionGroup: Locator;
  readonly contactNameGroup: Locator;
  readonly contactInfoGroup: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successSnackbar: Locator;

  constructor(page: Page, accessibilityBuilder: AxeBuilder) {
    this.page = page;
    this.accessibilityBuilder = accessibilityBuilder;
    this.titleGroup = page.getByTestId("information-model-title-fieldset");
    this.descriptionGroup = page.getByTestId(
      "information-model-description-fieldset",
    );
    this.contactNameGroup = page.getByTestId(
      "information-model-contact-name-fieldset",
    );
    this.contactInfoGroup = page.getByTestId(
      "information-model-contact-fields-fieldset",
    );
    this.saveButton = page.getByTestId("save-information-model-button");
    this.cancelButton = page.getByTestId("cancel-information-model-button");
    this.successSnackbar = page.getByText("Endringene ble lagret.");
  }

  async gotoNew(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/information-models/new`);
  }

  async goto(catalogId: string, informationModelId: string) {
    await this.page.goto(
      `/catalogs/${catalogId}/information-models/${informationModelId}/edit`,
    );
  }

  private languageInput(group: Locator, language: Language) {
    return group.getByRole("textbox", { name: languageLabels[language] });
  }

  private async fillLanguageField(
    group: Locator,
    values: TextByLanguage,
    { addLanguages }: { addLanguages: boolean },
  ) {
    for (const language of languages) {
      const value = values[language];
      if (value === undefined) {
        continue;
      }
      if (addLanguages) {
        await group
          .getByRole("button", { name: languageLabels[language], exact: true })
          .click();
      }
      await this.languageInput(group, language).fill(value);
    }
  }

  async fillNewForm({
    title,
    description,
    contactName,
    email,
  }: {
    title: TextByLanguage;
    description: TextByLanguage;
    contactName: TextByLanguage;
    email: string;
  }) {
    const addLanguages = { addLanguages: true };
    await this.fillLanguageField(this.titleGroup, title, addLanguages);
    await this.fillLanguageField(
      this.descriptionGroup,
      description,
      addLanguages,
    );
    await this.fillLanguageField(
      this.contactNameGroup,
      contactName,
      addLanguages,
    );
    await this.contactInfoGroup.getByRole("button", { name: "E-post" }).click();
    await this.contactInfoGroup.getByLabel("E-post").fill(email);
  }

  async replaceTitle(title: TextByLanguage) {
    await this.fillLanguageField(this.titleGroup, title, {
      addLanguages: false,
    });
  }

  async expectOnEditPageOfCreatedModel(catalogId: string): Promise<string> {
    const editUrl = new RegExp(
      `/catalogs/${catalogId}/information-models/([^/]+)/edit$`,
    );
    await expect(this.page).toHaveURL(editUrl);
    const informationModelId = new URL(this.page.url()).pathname.match(
      editUrl,
    )?.[1];
    if (!informationModelId) {
      throw new Error(`No information model id in ${this.page.url()}`);
    }
    return informationModelId;
  }

  async save() {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  async expectSaved() {
    await expect(this.successSnackbar).toBeVisible();
  }

  async expectTitleValue(language: Language, value: string) {
    await expect(
      this.titleGroup.getByRole("textbox", { name: languageLabels[language] }),
    ).toHaveValue(value);
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
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "aria-toggle-field-name", "target-size"])
      .exclude('input[role="combobox"][list]')
      .exclude('[class*="textareaWithPrefix"] [class*="__prefix"]')
      .analyze();
    expect(result.violations).toEqual([]);
  }
}
