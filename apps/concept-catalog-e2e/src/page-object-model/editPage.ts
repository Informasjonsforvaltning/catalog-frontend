import {
  expect,
  Page,
  BrowserContext,
  APIRequestContext,
  Locator,
} from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import {
  Concept,
  Definisjon,
  FieldsResult,
  LocalizedStrings,
  RelationSubtypeEnum,
  RelationTypeEnum,
  UnionRelation,
} from "@catalog-frontend/types";
import {
  clearCombobox,
  dismissSuggestionOverlays,
  fillSearchSuggestion,
  getFields,
  relationToSourceText,
  selectSuggestionOption,
} from "../utils/helpers";

export default class EditPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators

  async fillLanguageField(
    field: LocalizedStrings | undefined,
    group: string,
    open: string[],
    clear: boolean,
    parent?: Locator,
  ) {
    console.log(
      `[fillLanguageField] group: ${group}, open: ${JSON.stringify(open)}, clear: ${clear}`,
    );
    // Only close Suggestion popovers, Escape should not close dialogs.
    await dismissSuggestionOverlays(this.page);

    // Only use an explicit parent (e.g. dialog[open] or #example).
    // Auto-detecting is brittle.
    const root = parent ?? this.page;

    // Prefer a single fieldset inside section parents (#remark / #example).
    let groupLocator: Locator;
    if (parent) {
      const fieldsets = parent.locator("fieldset");
      groupLocator =
        (await fieldsets.count()) === 1
          ? fieldsets.first()
          : parent.getByRole("group", { name: group }).first();
    } else {
      groupLocator = root.getByRole("group", { name: group }).first();
    }
    await groupLocator.waitFor({ state: "visible" });
    await groupLocator.scrollIntoViewIfNeeded();

    if (clear) {
      console.log(
        `[fillLanguageField] Clearing existing values for group: ${group}`,
      );
      const removeBtn = groupLocator.getByRole("button", { name: "Slett" });
      while ((await removeBtn.count()) > 0) {
        const firstBtn = removeBtn.first();
        await firstBtn.waitFor({ state: "visible", timeout: 5000 });
        await firstBtn.click();
      }
    }

    // TextareaWithPrefix sets aria-label, prefer that over role+name.
    const languageInput = (lang: string) =>
      groupLocator
        .locator(`textarea[aria-label="${lang}"], input[aria-label="${lang}"]`)
        .or(groupLocator.getByRole("textbox", { name: lang }));

    if (open) {
      for (const lang of open) {
        const input = languageInput(lang);
        if (await input.isVisible()) {
          console.log(
            `[fillLanguageField] Language already open: ${lang} in group: ${group}`,
          );
          continue;
        }
        console.log(
          `[fillLanguageField] Opening language: ${lang} in group: ${group}`,
        );
        const addButton = groupLocator.getByRole("button", {
          name: lang,
          exact: true,
        });
        await addButton.scrollIntoViewIfNeeded();
        await dismissSuggestionOverlays(this.page);

        // Retry: Subject Suggestion can intercept the first click
        // Fall back to DOM click if the field never appears.
        for (let attempt = 0; attempt < 3; attempt++) {
          if (await input.isVisible()) {
            break;
          }
          if (attempt === 0) {
            await addButton.click();
          } else {
            await dismissSuggestionOverlays(this.page);
            await addButton.evaluate((el: HTMLElement) => el.click());
          }
          try {
            await input.waitFor({ state: "visible", timeout: 3000 });
            break;
          } catch {
            if (attempt === 2) {
              await input.waitFor({ state: "visible", timeout: 5000 });
            }
          }
        }
      }
    }

    const fillLanguageInput = async (lang: string, value: string) => {
      await dismissSuggestionOverlays(this.page);
      const input = languageInput(lang);
      await input.waitFor({ state: "visible", timeout: 5000 });
      await input.scrollIntoViewIfNeeded();
      await input.fill(value);
    };

    if (
      Array.isArray(field?.nb) ||
      Array.isArray(field?.nn) ||
      Array.isArray(field?.en)
    ) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Bokmål [${i}]: ${field.nb?.[i]}`,
        );
        await fillLanguageInput("Bokmål", field.nb?.[i] as string);
        await this.page.keyboard.press("Enter");
      }

      for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Nynorsk [${i}]: ${field.nn?.[i]}`,
        );
        await fillLanguageInput("Nynorsk", field.nn?.[i] as string);
        await this.page.keyboard.press("Enter");
      }

      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        console.log(
          `[fillLanguageField] Filling Engelsk [${i}]: ${field.en?.[i]}`,
        );
        await fillLanguageInput("Engelsk", field.en?.[i] as string);
        await this.page.keyboard.press("Enter");
      }
    } else {
      if (field?.nb) {
        console.log(`[fillLanguageField] Filling Bokmål: ${field.nb}`);
        await fillLanguageInput("Bokmål", field.nb);
      }
      if (field?.nn) {
        console.log(`[fillLanguageField] Filling Nynorsk: ${field.nn}`);
        await fillLanguageInput("Nynorsk", field.nn);
      }
      if (field?.en) {
        console.log(`[fillLanguageField] Filling Engelsk: ${field.en}`);
        await fillLanguageInput("Engelsk", field.en);
      }
    }
  }

  async addRelation(search: string, item: string, relation: UnionRelation) {
    await this.page.getByRole("button", { name: "Legg til relasjon" }).click();
    const dialog = this.page.getByRole("dialog");
    if (relation.internal) {
      await dialog
        .getByRole("radio", { name: "Virksomhetens eget begrep" })
        .click();
    } else {
      await dialog
        .getByRole("radio", { name: "Publisert begrep på data.norge.no" })
        .click();
    }

    const relationGroup = dialog.getByRole("group", {
      name: "Relatert begrep",
    });
    await fillSearchSuggestion(
      this.page,
      "Søk begrep",
      search,
      item,
      relationGroup,
    );

    await dialog.getByRole("combobox", { name: "Relasjon" }).click();
    if (relation.relasjon === RelationTypeEnum.ASSOSIATIV) {
      await dialog.getByRole("option", { name: "Assosiativ" }).click();
      await this.fillLanguageField(
        relation.beskrivelse,
        "Relasjonsrolle",
        ["Bokmål", "Nynorsk", "Engelsk"],
        false,
      );
    } else if (relation.relasjon === RelationTypeEnum.GENERISK) {
      await dialog.getByRole("option", { name: "Generisk" }).click();
      await dialog.getByRole("combobox", { name: "Nivå" }).click();
      if (relation.relasjonsType === RelationSubtypeEnum.OVERORDNET) {
        await dialog.getByRole("option", { name: "Overordnet" }).click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.UNDERORDNET) {
        await dialog.getByRole("option", { name: "Underordnet" }).click();
      }
      await this.fillLanguageField(
        relation.inndelingskriterium,
        "Inndelingskriterium",
        ["Bokmål", "Nynorsk", "Engelsk"],
        false,
      );
    } else if (relation.relasjon === RelationTypeEnum.PARTITIV) {
      await dialog.getByRole("option", { name: "Partitiv" }).click();
      await dialog.getByRole("combobox", { name: "Nivå" }).click();
      if (relation.relasjonsType === RelationSubtypeEnum.ER_DEL_AV) {
        await dialog.getByRole("option", { name: "Er del av" }).click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.OMFATTER) {
        await dialog.getByRole("option", { name: "Omfatter" }).click();
      }
      await this.fillLanguageField(
        relation.inndelingskriterium,
        "Inndelingskriterium",
        ["Bokmål", "Nynorsk", "Engelsk"],
        false,
      );
    } else if (relation.relasjon === RelationTypeEnum.SE_OGSÅ) {
      await dialog.getByRole("option", { name: "Se også" }).click();
    } else if (relation.relasjon === RelationTypeEnum.ERSTATTES_AV) {
      await dialog.getByRole("option", { name: "Erstattes av" }).click();
    }
    const addBtn = dialog.getByRole("button", { name: "Legg til relasjon" });
    await addBtn.click();
    await addBtn.waitFor({ state: "hidden", timeout: 5000 });
  }

  async clearFields(fields: FieldsResult) {
    const MAX_ITERATIONS = 20;

    // Loop 1: Remove all "Slett" buttons (definitions, etc.)
    let iterations = 0;
    const removeBtn = this.page.getByRole("button", { name: "Slett" });
    while ((await removeBtn.count()) > 0) {
      if (++iterations > MAX_ITERATIONS) {
        throw new Error(
          `clearFields: "Slett" loop exceeded ${MAX_ITERATIONS} iterations`,
        );
      }
      const firstBtn = removeBtn.first();
      await firstBtn.waitFor({ state: "visible", timeout: 5000 });
      await firstBtn.click();
      await this.page.waitForTimeout(300);
    }

    // Loop 2: Clear all suggestion selects. The label is "Tøm" (Suggestion.Clear),
    // not the deprecated Combobox's "Fjern alt", which no longer exists anywhere
    // in the app and made this loop silently match nothing.
    iterations = 0;
    const clearBtn = this.page.getByRole("button", { name: "Tøm" });
    while ((await clearBtn.count()) > 0) {
      if (++iterations > MAX_ITERATIONS) {
        throw new Error(
          `clearFields: "Tøm" loop exceeded ${MAX_ITERATIONS} iterations`,
        );
      }
      const firstClear = clearBtn.first();
      await firstClear.waitFor({ state: "visible", timeout: 5000 });
      await firstClear.click();
      await this.page.waitForTimeout(300);
    }

    // Loop 3: Clear relations table to exactly 1 row (header)
    // The table is replaced with a skeleton when loading, so wait for the table to be visible
    const relTable = this.page.getByRole("table").filter({
      has: this.page.getByRole("columnheader", { name: "Relasjon" }),
    });

    iterations = 0;
    while (
      (await relTable.getByRole("row").count()) === 0 ||
      (await relTable.getByRole("row").count()) > 1
    ) {
      if (++iterations > MAX_ITERATIONS) {
        const rowCount = await relTable.getByRole("row").count();
        throw new Error(
          `clearFields: Relations table loop exceeded ${MAX_ITERATIONS} iterations (rows: ${rowCount})`,
        );
      }
      if ((await relTable.getByRole("row").count()) > 1) {
        await relTable
          .getByRole("row")
          .last()
          .getByRole("button", { name: "Slett" })
          .click();
        await this.page.waitForTimeout(300);
      } else {
        await relTable
          .getByRole("row")
          .first()
          .waitFor({ state: "visible", timeout: 5000 });
      }
    }

    await this.page
      .getByRole("group", { name: "Begrepsstatus" })
      .locator(
        'input[type="radio"][value="http://publications.europa.eu/resource/authority/concept-status/DRAFT"]',
      )
      .click();

    await this.page.getByLabel("Major").fill("0");
    await this.page.getByLabel("Minor").fill("1");
    await this.page.getByLabel("Patch").fill("0");

    await this.page.getByLabel("Gyldig fra og med").clear();
    await this.page.getByLabel("Gyldig til og med").clear();

    const emailCheckbox = this.page.getByRole("checkbox", { name: "E-post" });
    if (await emailCheckbox.isChecked()) {
      await emailCheckbox.uncheck();
    }

    const phoneCheckbox = this.page.getByRole("checkbox", {
      name: "Telefonnummer",
    });
    if (await phoneCheckbox.isChecked()) {
      await phoneCheckbox.uncheck();
    }

    await this.page.getByRole("textbox", { name: "Forkortelse" }).clear();

    await clearCombobox(this.page, "Hvem skal begrepet tildeles?");

    for (const field of fields.internal) {
      if (field.type === "text_long" || field.type === "text_short") {
        await this.page
          .getByRole("textbox", { name: field.label?.nb as string })
          .clear();
      } else if (field.type === "boolean") {
        const checkbox = this.page
          .getByRole("group", { name: field.label?.nb as string })
          .getByRole("checkbox");
        if (await checkbox.isChecked()) {
          await checkbox.uncheck();
        }
      } else if (field.type === "code_list") {
        await clearCombobox(this.page, field.label?.nb as string);
      }
    }

    await dismissSuggestionOverlays(this.page);
  }

  // Helpers
  async fillFormAndSave(
    concept: Concept,
    apiRequestContext: APIRequestContext,
    clearBeforeFill = false,
  ) {
    const fields = await getFields(apiRequestContext);

    console.log(
      "[EDIT PAGE] fillFormAndSave called with clearBeforeFill:",
      clearBeforeFill,
    );
    if (clearBeforeFill) {
      console.log("[EDIT PAGE] Clearing all fields before filling...");
      await this.clearFields(fields);
    }

    console.log("[EDIT PAGE] Filling anbefaltTerm...");
    await this.fillLanguageField(
      concept.anbefaltTerm?.navn,
      "Anbefalt term Hjelp til utfylling",
      ["Engelsk"],
      clearBeforeFill,
    );
    console.log("[EDIT PAGE] Filling tillattTerm...");
    await this.fillLanguageField(
      concept.tillattTerm,
      "Tillatt term Hjelp til utfylling",
      ["Bokmål", "Nynorsk", "Engelsk"],
      clearBeforeFill,
    );
    console.log("[EDIT PAGE] Filling frarådetTerm...");
    await this.fillLanguageField(
      concept.frarådetTerm,
      "Frarådet term Hjelp til utfylling",
      ["Bokmål", "Nynorsk", "Engelsk"],
      clearBeforeFill,
    );

    // Add definition without target group
    console.log("[EDIT PAGE] Adding definition without target group...");
    await this.page.getByRole("button", { name: "Uten målgruppe" }).click();
    const definitionDialog = this.page.locator("dialog[open]");
    await definitionDialog.waitFor({ state: "visible", timeout: 5000 });
    await this.fillLanguageField(
      concept.definisjon?.tekst,
      "Definisjon Hjelp til utfylling",
      ["Bokmål", "Nynorsk", "Engelsk"],
      clearBeforeFill,
      definitionDialog,
    );
    console.log(
      "[EDIT PAGE] Selecting forholdTilKilde:",
      concept.definisjon?.kildebeskrivelse?.forholdTilKilde,
    );
    await definitionDialog
      .getByRole("group", { name: "Forhold til kilde" })
      .getByLabel(
        relationToSourceText(
          concept.definisjon?.kildebeskrivelse?.forholdTilKilde,
        ) as string,
      )
      .click();
    if (
      concept.definisjon?.kildebeskrivelse?.forholdTilKilde !== "egendefinert"
    ) {
      console.log("[EDIT PAGE] Adding kildebeskrivelse...");
      await definitionDialog
        .getByRole("button", { name: "Legg til kilde" })
        .click();
      await definitionDialog
        .getByRole("textbox", { name: "Kildebeskrivelse" })
        .fill("Kilde");
    }

    console.log('[EDIT PAGE] Clicking "Legg til definisjon"...');
    await definitionDialog
      .getByRole("button", { name: "Legg til definisjon" })
      .click();
    await definitionDialog.waitFor({ state: "hidden", timeout: 5000 });

    // Add remark
    console.log("[EDIT PAGE] Filling merknad...");
    await this.fillLanguageField(
      concept.merknad,
      "Merknad Anbefalt",
      ["Bokmål", "Nynorsk", "Engelsk"],
      clearBeforeFill,
      this.page.locator("#remark"),
    );

    // Example
    console.log("[EDIT PAGE] Filling eksempel...");
    await this.fillLanguageField(
      concept.eksempel,
      "Eksempel",
      ["Bokmål", "Nynorsk", "Engelsk"],
      clearBeforeFill,
      this.page.locator("#example"),
    );

    // Select subject
    console.log("[EDIT PAGE] Selecting Fagområde...");
    await selectSuggestionOption(
      this.page,
      "Fagområde (velg fra liste)",
      "Sprekkmunk",
      this.page.locator("#subject"),
    );
    await dismissSuggestionOverlays(this.page);

    // Application
    console.log("[EDIT PAGE] Filling omfang...");
    await this.page.getByLabel("Beskrivelse").click();
    await this.page.getByLabel("Beskrivelse").fill(concept.omfang?.tekst ?? "");
    await this.page
      .getByLabel("Lenke til referanse")
      .fill(concept.omfang?.uri ?? "");

    // Internal fields
    console.log("[EDIT PAGE] Filling interneFelt...");
    for (const field of fields.internal) {
      if (concept.interneFelt?.[field.id]) {
        if (field.type === "text_long" || field.type === "text_short") {
          console.log(
            `[EDIT PAGE] Filling internal field (text): ${field.label?.nb} = ${concept.interneFelt[field.id].value}`,
          );
          await this.page
            .getByRole("textbox", { name: field.label?.nb as string })
            .fill(concept.interneFelt[field.id].value);
        } else if (field.type === "boolean") {
          console.log(
            `[EDIT PAGE] Setting internal field (boolean): ${field.label?.nb} = ${concept.interneFelt[field.id].value}`,
          );
          const checkbox = this.page
            .getByRole("group", { name: field.label?.nb as string })
            .getByRole("checkbox");
          if (
            concept.interneFelt[field.id].value === "true" &&
            !(await checkbox.isChecked())
          ) {
            await checkbox.check();
          }
        }
      }
    }

    console.log("[EDIT PAGE] Selecting assigned user...");
    await selectSuggestionOption(
      this.page,
      "Hvem skal begrepet tildeles?",
      "Avery Quokka",
    );

    console.log("[EDIT PAGE] Filling abbreviatedLabel...");
    await this.page
      .getByRole("textbox", { name: "Forkortelse" })
      .fill(concept.abbreviatedLabel as string);
    for (let i = 0; i < (concept.merkelapp?.length ?? 0); i++) {
      console.log(`[EDIT PAGE] Adding merkelapp: ${concept.merkelapp?.[i]}`);
      await this.page
        .getByLabel("Merkelapp")
        .fill(concept.merkelapp?.[i] as string);
      await this.page.keyboard.press("Enter");
    }

    // Status
    console.log("[EDIT PAGE] Selecting statusURI:", concept.statusURI);
    await this.page
      .getByRole("group", { name: "Begrepsstatus" })
      .locator(`input[type="radio"][value="${concept.statusURI}"]`)
      .click();

    // Version
    console.log("[EDIT PAGE] Filling version:", concept.versjonsnr);
    await this.page.getByLabel("Major").fill(`${concept.versjonsnr?.major}`);
    await this.page.getByLabel("Minor").fill(`${concept.versjonsnr?.minor}`);
    await this.page.getByLabel("Patch").fill(`${concept.versjonsnr?.patch}`);

    if (concept.gyldigFom) {
      console.log("[EDIT PAGE] Filling gyldigFom:", concept.gyldigFom);
      await this.page.getByLabel("Gyldig fra og med").fill(concept.gyldigFom);
    }
    if (concept.gyldigTom) {
      console.log("[EDIT PAGE] Filling gyldigTom:", concept.gyldigTom);
      await this.page.getByLabel("Gyldig til og med").fill(concept.gyldigTom);
    }

    if (concept.kontaktpunkt?.harEpost) {
      console.log(
        "[EDIT PAGE] Filling kontaktpunkt.harEpost:",
        concept.kontaktpunkt.harEpost,
      );
      await this.page.getByRole("checkbox", { name: "E-postadresse" }).check();
      await this.page
        .getByRole("textbox", { name: "E-postadresse" })
        .fill(concept.kontaktpunkt.harEpost);
    }

    if (concept.kontaktpunkt?.harTelefon) {
      console.log(
        "[EDIT PAGE] Filling kontaktpunkt.harTelefon:",
        concept.kontaktpunkt.harTelefon,
      );
      await this.page.getByRole("checkbox", { name: "Telefonnummer" }).check();
      await this.page
        .getByRole("textbox", { name: "Telefonnummer" })
        .fill(concept.kontaktpunkt.harTelefon);
    }

    // Save concept
    await this.dismissDevOverlay();
    console.log('[EDIT PAGE] Clicking "Lagre"...');
    await this.page.getByRole("button", { name: "Lagre" }).click();
    console.log("[EDIT PAGE] Waiting for confirmation message...");
    await this.page
      .getByText("Endringene ble lagret.")
      .waitFor({ state: "visible" });
    console.log("[EDIT PAGE] Form filled and saved successfully.");
  }

  public async goto(id?: string) {
    await this.page.goto(id ? `${this.url}/${id}/edit` : `${this.url}/new`);
  }

  async expectEditPageUrl(conceptId: string) {
    await this.page.waitForURL(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${conceptId}/edit`,
    );
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "color-contrast", "aria-allowed-role"])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }

  public async expectMenu() {
    await expect(
      this.page.getByRole("heading", { name: "Innhold i skjema" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(this.page.getByRole("list").getByText("Term *")).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Definisjon *"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Merknad"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Fagområde"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Eksempel"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Verdiområde"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Relasjoner"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Interne opplysninger"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Begrepsstatus"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Versjon"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Gyldighetsperiode"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText("Kontaktinformasjon *"),
    ).toBeVisible();
  }

  async expectRestoreDialog() {
    await expect(this.page.getByRole("dialog")).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Ulagrede endringer" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Gjenopprett" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Forkast" }),
    ).toBeVisible();
  }

  async expectRestoreDialogShowsTerm(term: string) {
    const dialog = this.page.getByRole("dialog");
    await expect(dialog.getByText(term)).toBeVisible();
  }

  async clickRestoreButton() {
    await this.page.getByRole("button", { name: "Gjenopprett" }).click();
    await this.page
      .getByRole("dialog")
      .waitFor({ state: "hidden", timeout: 5000 });
  }

  async expectRestoreSuccessMessage() {
    const message = this.page.getByText("Endringene ble gjenopprettet.");
    await expect(message).toBeVisible();
    await message.locator("..").getByRole("button").click();
    await message.waitFor({ state: "hidden", timeout: 5000 });
  }

  async clickDiscardButton() {
    await this.page.getByRole("button", { name: "Forkast" }).click();
    await this.page
      .getByRole("dialog")
      .waitFor({ state: "hidden", timeout: 5000 });
  }

  async expectNoRestoreDialog() {
    // Wait for form to be interactive (Save button visible means form is ready)
    await expect(
      this.page.getByRole("button", { name: "Lagre" }),
    ).toBeVisible();

    // Now verify no dialog is visible
    await expect(this.page.getByRole("dialog")).not.toBeVisible();
  }

  async waitForAutoSaveToComplete() {
    // Wait for localStorage to have the auto-save data
    await this.page.waitForFunction(
      () => localStorage.getItem("conceptForm") !== null,
      { timeout: 5000 },
    );
  }

  async waitForAutoSaveToClear() {
    // Wait for localStorage auto-save data to be cleared (when form matches original)
    await this.page.waitForFunction(
      () => localStorage.getItem("conceptForm") === null,
      { timeout: 5000 },
    );
  }

  async waitForRelationAutoSaveToComplete() {
    // Wait for localStorage to have the relation modal auto-save data
    await this.page.waitForFunction(
      () => localStorage.getItem("conceptFormRelation") !== null,
      { timeout: 5000 },
    );
  }

  // Helper methods for concept form fields
  async expectAnbefaltTermField(language: string, expectedValue: string) {
    const termField = this.page
      .getByRole("group", {
        name: "Anbefalt term Hjelp til utfylling Må fylles ut",
      })
      .getByLabel(language);
    await expect(termField).toBeVisible();
    await expect(termField).toHaveValue(expectedValue);
  }

  async fillAnbefaltTermField(
    value: LocalizedStrings,
    open: string[],
    clear: boolean,
  ) {
    await this.fillLanguageField(
      value,
      "Anbefalt term Hjelp til utfylling Må fylles ut",
      open,
      clear,
    );
  }

  async expectDefinitionCard(
    definition: Definisjon,
    targetGroup: "uten målgruppe" | "for allmennheten" | "for spesialister",
  ) {
    const type =
      targetGroup === "uten målgruppe" ? "(uten målgruppe)" : targetGroup;
    const sourceCount = definition.kildebeskrivelse?.kilde.length || 0;
    const sourceText = sourceCount === 1 ? "kilde" : "kilder";

    const heading = this.page.getByRole("heading", {
      name: `Definisjon ${type}`,
      level: 3,
    });
    await expect(heading).toBeVisible();

    const card = this.page
      .locator('[data-color="neutral"]')
      .filter({ has: heading });

    if (sourceCount) {
      await expect(
        card.getByRole("button", { name: `${sourceCount} ${sourceText}` }),
      ).toBeVisible();
    } else {
      await expect(card.getByText("Ingen kilder")).toBeVisible();
    }

    const languages = Object.keys(definition.tekst).map((language) =>
      language === "nb" ? "Bokmål" : language === "nn" ? "Nynorsk" : "Engelsk",
    );
    for (const lang of languages) {
      await expect(card.locator(".ds-tag", { hasText: lang })).toBeVisible();
    }

    return card;
  }

  async editDefinition(
    definition: Definisjon,
    targetGroup: "uten målgruppe" | "for allmennheten" | "for spesialister",
  ) {
    const card = await this.expectDefinitionCard(definition, targetGroup);
    await card.getByRole("button", { name: "Rediger" }).click();
  }

  async fillDefinitionField(
    value: LocalizedStrings,
    open: string[],
    clear: boolean,
  ) {
    const definitionDialog = this.page.locator("dialog[open]");
    await definitionDialog.waitFor({ state: "visible", timeout: 5000 });
    await this.fillLanguageField(
      value,
      "Definisjon Hjelp til utfylling",
      open,
      clear,
      definitionDialog,
    );
  }

  async clickAddRelation() {
    await this.page.getByRole("button", { name: "Legg til relasjon" }).click();
  }

  // The Next dev overlay badge only exists when the app has dev time issues, so
  // the click has to be guarded. Clicking it unconditionally hangs until the test
  // timeout whenever there are no issues.
  async dismissDevOverlay() {
    const collapseButton = this.page.getByRole("button", {
      name: "Collapse issues badge",
    });
    if (await collapseButton.isVisible()) {
      console.log("[EDIT PAGE] Closing Nextjs portal issues...");
      await collapseButton.click();
    }
  }

  async clickSaveButton(success: boolean = true) {
    await this.dismissDevOverlay();
    await this.page.getByRole("button", { name: "Lagre" }).click();
    if (success) {
      await this.page
        .getByText("Endringene ble lagret.")
        .waitFor({ state: "visible" });
    }
  }
}
