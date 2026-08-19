import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { LocalizedStrings } from "@catalog-frontend/types";

export default class ServicesEditPage {
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  // Legend includes help button + required tag, match as substring.
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
    // exact: true so this does not match the "Lagrer" spinner
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

  // On /new, pass languages to open. On edit `open` should be left empty.
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

  // Empties every language input rather than deleting them, so the fieldset stays
  async clearDescription() {
    for (const language of ["Bokmål", "Nynorsk", "Engelsk"]) {
      const input = this.descriptionGroup.getByLabel(language);
      if (await input.isVisible()) {
        await input.fill("");
      }
    }
  }

  // Checked by default, which validates against the lenient draft schema
  async setIgnoreRequired(ignore: boolean) {
    if (ignore) {
      await this.ignoreRequiredCheckbox.check();
    } else {
      await this.ignoreRequiredCheckbox.uncheck();
    }
  }

  // Edit page can exceed the 5s expect timeout after detail → edit.
  async expectFormReady() {
    await expect(this.saveButton).toBeVisible({ timeout: 30000 });
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
