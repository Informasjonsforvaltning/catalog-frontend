import { expect, Page, BrowserContext, Locator } from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import { clearCombobox } from "../utils/helpers";

export default class DataServiceEditPage {
  protected page: Page;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;

  // Form fields
  readonly titleGroup: Locator;
  readonly titleNbInput: Locator;
  readonly titleNnInput: Locator;
  readonly titleEnInput: Locator;
  readonly descriptionGroup: Locator;
  readonly descriptionNbInput: Locator;
  readonly descriptionNnInput: Locator;
  readonly descriptionEnInput: Locator;
  readonly endpointUrlGroup: Locator;
  readonly endpointUrlInput: Locator;
  readonly endpointDescriptionGroup: Locator;
  readonly endpointDescriptionNbInput: Locator;
  readonly endpointDescriptionNnInput: Locator;
  readonly endpointDescriptionEnInput: Locator;
  readonly keywordsGroup: Locator;
  readonly keywordsNbInput: Locator;
  readonly keywordsNnInput: Locator;
  readonly keywordsEnInput: Locator;
  readonly contactNameGroup: Locator;
  readonly contactNameNbInput: Locator;
  readonly contactNameNnInput: Locator;
  readonly contactNameEnInput: Locator;
  readonly contactInfoGroup: Locator;
  readonly contactEmailButton: Locator;
  readonly contactPhoneButton: Locator;
  readonly contactUrlButton: Locator;
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactUrlInput: Locator;
  readonly statusGroup: Locator;
  readonly licenseGroup: Locator;
  readonly accessRightsGroup: Locator;
  readonly availabilityGroup: Locator;

  // Buttons
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly publishButton: Locator;
  readonly unpublishButton: Locator;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder?: AxeBuilder,
  ) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;

    // Form fields
    this.titleGroup = page.getByRole("group", {
      name: "Tittel Hjelp til utfylling Må fylles ut",
    });
    this.titleNbInput = this.titleGroup.getByLabel("Bokmål");
    this.titleNnInput = this.titleGroup.getByLabel("Nynorsk");
    this.titleEnInput = this.titleGroup.getByLabel("Engelsk");
    this.descriptionGroup = page.getByRole("group", {
      name: "Beskrivelse av API-et Hjelp til utfylling",
    });
    this.descriptionNbInput = this.descriptionGroup.getByLabel("Bokmål");
    this.descriptionNnInput = this.descriptionGroup.getByLabel("Nynorsk");
    this.descriptionEnInput = this.descriptionGroup.getByLabel("Engelsk");
    this.endpointUrlInput = page.getByRole("textbox", {
      name: "EndepunktsURL Hjelp til utfylling Må fylles ut",
    });
    this.endpointDescriptionGroup = page.getByRole("group", {
      name: "Endepunktbeskrivelse Hjelp til utfylling Anbefalt",
    });
    this.endpointDescriptionNbInput =
      this.endpointDescriptionGroup.getByLabel("Bokmål");
    this.endpointDescriptionNnInput =
      this.endpointDescriptionGroup.getByLabel("Nynorsk");
    this.endpointDescriptionEnInput =
      this.endpointDescriptionGroup.getByLabel("Engelsk");
    this.keywordsGroup = page.getByRole("group", {
      name: "Emneord Hjelp til utfylling Anbefalt",
    });
    this.keywordsNbInput = this.keywordsGroup.getByLabel("Bokmål");
    this.keywordsNnInput = this.keywordsGroup.getByLabel("Nynorsk");
    this.keywordsEnInput = this.keywordsGroup.getByLabel("Engelsk");
    this.contactNameGroup = page.getByRole("group", {
      name: "Navn Hjelp til utfylling Må fylles ut",
    });
    this.contactNameNbInput = this.contactNameGroup.getByLabel("Bokmål");
    this.contactNameNnInput = this.contactNameGroup.getByLabel("Nynorsk");
    this.contactNameEnInput = this.contactNameGroup.getByLabel("Engelsk");
    this.contactInfoGroup = page.getByRole("group", {
      name: "Kontaktinformasjon Hjelp til utfylling Må fylles ut",
    });
    this.contactEmailButton = this.contactInfoGroup.getByRole("button", {
      name: "E-post",
    });
    this.contactPhoneButton = this.contactInfoGroup.getByRole("button", {
      name: "Telefon",
    });
    this.contactUrlButton = this.contactInfoGroup.getByRole("button", {
      name: "Kontaktside",
    });
    this.contactEmailInput = page
      .getByRole("group", { name: "E-post" })
      .getByRole("textbox");
    this.contactPhoneInput = page
      .getByRole("group", { name: "Telefon" })
      .getByRole("textbox");
    this.contactUrlInput = page
      .getByRole("group", { name: "Kontaktside" })
      .getByRole("textbox");
    this.statusGroup = page.getByRole("group", { name: "Status" });
    this.licenseGroup = page.getByRole("group", { name: "Lisens" });
    this.accessRightsGroup = page.getByRole("group", {
      name: "Tilgangsrettigheter",
    });
    this.availabilityGroup = page.getByRole("group", {
      name: "Tilgjengelighet",
    });

    // Buttons
    this.saveButton = page.getByTestId("save-data-service-button");
    this.cancelButton = page.getByTestId("cancel-data-service-button");
    this.deleteButton = page.getByRole("button", { name: "Slett" });
    this.publishButton = page.getByRole("button", { name: "Publiser" });
    this.unpublishButton = page.getByRole("button", { name: "Avpubliser" });
  }

  // Navigation
  async goto(catalogId: string, dataServiceId: string) {
    await this.page.goto(
      `/catalogs/${catalogId}/data-services/${dataServiceId}/edit`,
    );
  }

  async gotoNew(catalogId: string) {
    await this.page.goto(`/catalogs/${catalogId}/data-services/new`);
  }

  // Language field helper
  async fillLanguageField(
    field: any,
    group: string,
    open: string[],
    clear: boolean,
    parent?: Locator,
  ) {
    console.log(
      `[fillLanguageField] group: ${group}, open: ${JSON.stringify(open)}, clear: ${clear}`,
    );
    await (parent ?? this.page)
      .getByRole("group", { name: group })
      .first()
      .waitFor({ state: "visible" });

    if (clear) {
      console.log(
        `[fillLanguageField] Clearing existing values for group: ${group}`,
      );
      const removeBtn = (parent ?? this.page)
        .getByRole("group", { name: group })
        .getByRole("button", { name: "Slett" });
      while ((await removeBtn.count()) > 0) {
        await removeBtn.first().click();
      }
    }

    if (open) {
      for (const lang of open) {
        console.log(
          `[fillLanguageField] Opening language: ${lang} in group: ${group}`,
        );
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByRole("button", { name: lang })
          .click();
      }
    }

    if (
      Array.isArray(field?.nb) ||
      Array.isArray(field?.nn) ||
      Array.isArray(field?.en)
    ) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Bokmål [${i}]: ${field.nb[i]}`,
        );
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Bokmål")
          .fill(field.nb[i]);
        await this.page.keyboard.press("Enter");
      }

      for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Nynorsk [${i}]: ${field.nn[i]}`,
        );
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Nynorsk")
          .fill(field.nn[i]);
        await this.page.keyboard.press("Enter");
      }

      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Engelsk [${i}]: ${field.en[i]}`,
        );
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Engelsk")
          .fill(field.en[i]);
        await this.page.keyboard.press("Enter");
      }
    } else {
      if (field?.nb) {
        console.log(`[fillLanguageField] Filling Bokmål: ${field.nb}`);
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Bokmål")
          .fill(field.nb);
      }
      if (field?.nn) {
        console.log(`[fillLanguageField] Filling Nynorsk: ${field.nn}`);
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Nynorsk")
          .fill(field.nn);
      }
      if (field?.en) {
        console.log(`[fillLanguageField] Filling Engelsk: ${field.en}`);
        await (parent ?? this.page)
          .getByRole("group", { name: group })
          .getByLabel("Engelsk")
          .fill(field.en);
      }
    }
  }

  // Form actions
  async fillTitle(
    title: { nb?: string; nn?: string; en?: string },
    open: string[] = ["Bokmål", "Nynorsk", "Engelsk"],
    clear: boolean = false,
  ) {
    await this.fillLanguageField(
      title,
      "Tittel Hjelp til utfylling Må fylles ut",
      open,
      clear,
    );
  }

  async fillDescription(
    description: { nb?: string; nn?: string; en?: string },
    open: string[] = ["Bokmål", "Nynorsk", "Engelsk"],
    clear: boolean = false,
  ) {
    await this.fillLanguageField(
      description,
      "Beskrivelse av API-et Hjelp til utfylling",
      open,
      clear,
    );
  }

  async fillEndpointUrl(url: string) {
    await this.endpointUrlInput.fill(url);
  }

  async fillKeywords(
    keywords: { nb?: string[]; nn?: string[]; en?: string[] },
    open: string[] = ["Bokmål", "Nynorsk", "Engelsk"],
    clear: boolean = false,
  ) {
    await this.fillLanguageField(
      keywords,
      "Emneord Hjelp til utfylling Anbefalt",
      open,
      clear,
    );
  }

  async fillContactPoint(contactPoint: {
    name?: { nb?: string; nn?: string; en?: string };
    email?: string;
    phone?: string;
    url?: string;
  }) {
    if (contactPoint.name) {
      await this.fillLanguageField(
        contactPoint.name,
        "Navn Hjelp til utfylling Må fylles ut",
        ["Bokmål", "Nynorsk", "Engelsk"],
        false,
      );
    }
    if (contactPoint.email) {
      if (await this.contactEmailButton.isVisible()) {
        await this.contactEmailButton.click();
      }
      await this.contactEmailInput.fill(contactPoint.email);
    }
    if (contactPoint.phone) {
      if (await this.contactPhoneButton.isVisible()) {
        await this.contactPhoneButton.click();
      }
      await this.contactPhoneInput.fill(contactPoint.phone);
    }
    if (contactPoint.url) {
      if (await this.contactUrlButton.isVisible()) {
        await this.contactUrlButton.click();
      }
      await this.contactUrlInput.fill(contactPoint.url);
    }
  }

  async selectStatus(status: string) {
    await this.statusGroup.getByRole("combobox").selectOption(status);
  }

  async selectLicense(license: string) {
    await this.licenseGroup.getByRole("combobox").selectOption(license);
  }

  async selectAccessRights(accessRights: string) {
    await this.accessRightsGroup
      .getByRole("combobox")
      .selectOption(accessRights);
  }

  async selectAvailability(availability: string) {
    await this.availabilityGroup
      .getByRole("combobox")
      .selectOption(availability);
  }

  // Button actions
  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickPublish() {
    await this.publishButton.click();
  }

  async clickUnpublish() {
    await this.unpublishButton.click();
  }

  // Form filling helpers
  async fillDataServiceForm(dataService: {
    title?: { nb?: string; nn?: string; en?: string };
    description?: { nb?: string; nn?: string; en?: string };
    endpointUrl?: string;
    keywords?: { nb?: string[]; nn?: string[]; en?: string[] };
    contactPoint?: {
      name?: { nb?: string; nn?: string; en?: string };
      email?: string;
      phone?: string;
      url?: string;
    };
    status?: string;
    license?: string;
    accessRights?: string;
    availability?: string;
  }) {
    if (dataService.title) await this.fillTitle(dataService.title);
    if (dataService.description)
      await this.fillDescription(dataService.description);
    if (dataService.endpointUrl)
      await this.fillEndpointUrl(dataService.endpointUrl);
    if (dataService.keywords) await this.fillKeywords(dataService.keywords);
    if (dataService.contactPoint)
      await this.fillContactPoint(dataService.contactPoint);
    if (dataService.status) await this.selectStatus(dataService.status);
    if (dataService.license) await this.selectLicense(dataService.license);
    if (dataService.accessRights)
      await this.selectAccessRights(dataService.accessRights);
    if (dataService.availability)
      await this.selectAvailability(dataService.availability);
  }

  // Assertions
  async expectTitleToBe(title: { nb?: string; nn?: string; en?: string }) {
    if (title.nb) await expect(this.titleNbInput).toHaveValue(title.nb);
    if (title.nn) await expect(this.titleNnInput).toHaveValue(title.nn);
    if (title.en) await expect(this.titleEnInput).toHaveValue(title.en);
  }

  async expectDescriptionToBe(description: {
    nb?: string;
    nn?: string;
    en?: string;
  }) {
    if (description.nb)
      await expect(this.descriptionNbInput).toHaveValue(description.nb);
    if (description.nn)
      await expect(this.descriptionNnInput).toHaveValue(description.nn);
    if (description.en)
      await expect(this.descriptionEnInput).toHaveValue(description.en);
  }

  async expectEndpointUrlToBe(url: string) {
    await expect(this.endpointUrlInput).toHaveValue(url);
  }

  async expectSaveButtonVisible() {
    await expect(this.saveButton).toBeVisible();
  }

  async expectCancelButtonVisible() {
    await expect(this.cancelButton).toBeVisible();
  }

  async expectDeleteButtonVisible() {
    await expect(this.deleteButton).toBeVisible();
  }

  async expectPublishButtonVisible() {
    await expect(this.publishButton).toBeVisible();
  }

  async expectUnpublishButtonVisible() {
    await expect(this.unpublishButton).toBeVisible();
  }

  async expectDataServiceEditPageUrl(catalogId: string, dataServiceId: string) {
    await expect(this.page).toHaveURL(
      `/catalogs/${catalogId}/data-services/${dataServiceId}/edit`,
    );
  }

  async expectNewDataServicePageUrl(catalogId: string) {
    await expect(this.page).toHaveURL(
      `/catalogs/${catalogId}/data-services/new`,
    );
  }

  // Accessibility
  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "aria-toggle-field-name", "target-size"])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
