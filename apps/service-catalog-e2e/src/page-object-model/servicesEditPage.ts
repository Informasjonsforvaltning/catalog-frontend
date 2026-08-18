import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { LocalizedStrings } from "@catalog-frontend/types";

export default class ServicesEditPage {
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  // Group names come from TitleWithHelpTextAndTag, which appends the help
  // button's aria-label and the required/recommended tag to the legend. They are
  // therefore matched as substrings; exact: true would not match.
  readonly titleGroup: Locator;
  readonly descriptionGroup: Locator;
  readonly contactCategoryGroup: Locator;
  readonly contactInfoGroup: Locator;
  readonly homepageInput: Locator;
  readonly ignoreRequiredCheckbox: Locator;
  readonly saveButton: Locator;
  readonly successSnackbar: Locator;
  readonly errorSnackbar: Locator;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;

    this.titleGroup = page.getByRole("group", {
      name: "Tittel Hjelp til utfylling Må fylles ut",
    });
    this.descriptionGroup = page.getByRole("group", {
      name: "Beskrivelse Hjelp til utfylling Må fylles ut",
    });
    this.contactCategoryGroup = page.getByRole("group", {
      name: "Navn Hjelp til utfylling Må fylles ut",
    });
    this.contactInfoGroup = page.getByRole("group", {
      name: "Kontaktinformasjon Hjelp til utfylling Må fylles ut",
    });
    this.homepageInput = page.getByRole("textbox", { name: "Hjemmeside" });
    this.ignoreRequiredCheckbox = page.getByRole("checkbox", {
      name: "Ignorer påkrevde felt",
    });
    // exact: true because the form also renders "Lagre endringer" elsewhere, and
    // the submitting state swaps in a Spinner labelled "Lagrer"
    this.saveButton = page.getByRole("button", { name: "Lagre", exact: true });
    this.successSnackbar = page.getByText("Endringene ble lagret.");
    this.errorSnackbar = page.getByText("Lagring feilet");
  }

  // Navigation
  async goto(catalogId: string, serviceId: string) {
    await this.page.goto(`/catalogs/${catalogId}/services/${serviceId}/edit`);
  }

  async gotoNew(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/services/new`);
  }

  // On /new no language input is rendered yet, so the language has to be opened
  // first. On an existing service the inputs are already there and `open` should
  // be left empty.
  async fillLanguageField(
    group: Locator,
    field: LocalizedStrings,
    open: string[] = [],
  ) {
    await group.waitFor({ state: "visible" });
    for (const language of open) {
      await group.getByRole("button", { name: language, exact: true }).click();
    }
    if (field.nb) {
      await group.getByLabel("Bokmål").fill(field.nb as string);
    }
    if (field.nn) {
      await group.getByLabel("Nynorsk").fill(field.nn as string);
    }
    if (field.en) {
      await group.getByLabel("Engelsk").fill(field.en as string);
    }
  }

  async fillTitle(title: LocalizedStrings, open: string[] = []) {
    await this.fillLanguageField(this.titleGroup, title, open);
  }

  async fillDescription(description: LocalizedStrings, open: string[] = []) {
    await this.fillLanguageField(this.descriptionGroup, description, open);
  }

  async fillContactCategory(category: LocalizedStrings, open: string[] = []) {
    await this.fillLanguageField(this.contactCategoryGroup, category, open);
  }

  async fillContactEmail(email: string) {
    await this.contactInfoGroup.getByLabel("E-post").fill(email);
  }

  async fillHomepage(homepage: string) {
    await this.homepageInput.fill(homepage);
  }

  // "Ignorer påkrevde felt" is checked by default, which validates against the
  // lenient draft schema. Uncheck it to apply the full schema.
  async setIgnoreRequired(ignore: boolean) {
    if (ignore) {
      await this.ignoreRequiredCheckbox.check();
    } else {
      await this.ignoreRequiredCheckbox.uncheck();
    }
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async expectSaveSuccessful() {
    await expect(this.successSnackbar).toBeVisible();
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
