import { expect, Page, BrowserContext, Locator } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Concept, LocalizedStrings, RelationSubtypeEnum, RelationTypeEnum, UnionRelation, UriWithLabel } from '@catalog-frontend/types';
import { clearCombobox, getParentLocator, relationToSourceText } from '../utils/helpers';

export default class DatasetEditPage {
  url: string;
  protected page: Page;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');

  async fillLanguageField(field, group, open, clear, parent?: Locator) {
    console.log(`[fillLanguageField] group: ${group}, open: ${JSON.stringify(open)}, clear: ${clear}`);
    await (parent ?? this.page).getByRole('group', { name: group }).first().waitFor({ state: 'visible' });

    if (clear) {
      console.log(`[fillLanguageField] Clearing existing values for group: ${group}`);
      const removeBtn = (parent ?? this.page).getByRole('group', { name: group }).getByRole('button', { name: 'Slett' });
      while ((await removeBtn.count()) > 0) {
        await removeBtn.first().click();
      }
    }

    if (open) {
      for (const lang of open) {
        console.log(`[fillLanguageField] Opening language: ${lang} in group: ${group}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByRole('button', { name: lang }).click();
      }
    }

    if (Array.isArray(field?.nb) || Array.isArray(field?.nn) || Array.isArray(field?.en)) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Bokmål [${i}]: ${field.nb[i]}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Nynorsk [${i}]: ${field.nn[i]}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Engelsk [${i}]: ${field.en[i]}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en[i]);
        await this.page.keyboard.press('Enter');
      }
    } else {
      if (field?.nb) {
        console.log(`[fillLanguageField] Filling Bokmål: ${field.nb}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb);
      }
      if (field?.nn) {
        console.log(`[fillLanguageField] Filling Nynorsk: ${field.nn}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn);
      }
      if (field?.en) {
        console.log(`[fillLanguageField] Filling Engelsk: ${field.en}`);
        await (parent ?? this.page).getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en);
      }
    }
  }

  async addRelation(search, item, relation: UnionRelation) {
    await this.page.getByRole('button', { name: 'Legg til relasjon' }).click();
    if (relation.internal) {
      await this.page.getByText('Virksomhetens eget begrep').click();
    } else {
      await this.page.getByText('Publisert begrep på data.norge.no').click();
    }

    await this.page.getByRole('group', { name: 'Relatert begrep' }).getByRole('combobox').click();
    await this.page.waitForTimeout(100);
    await this.page.getByRole('group', { name: 'Relatert begrep' }).getByLabel('Søk begrep').fill(search);
    await this.page.waitForTimeout(100);
    await this.page.getByLabel(item).first().click();
    await this.page.waitForTimeout(100);

    await this.page.getByLabel('RelasjonMå fylles ut').click();
    if (relation.relasjon === RelationTypeEnum.ASSOSIATIV) {
      await this.page.getByLabel('Assosiativ').click();
      await this.fillLanguageField(relation.beskrivelse, 'Relasjonsrolle', ['Bokmål', 'Nynorsk', 'Engelsk'], false);
    } else if (relation.relasjon === RelationTypeEnum.GENERISK) {
      await this.page.getByLabel('Generisk').click();
      await this.page.getByLabel('Nivå').click();
      if (relation.relasjonsType === RelationSubtypeEnum.OVERORDNET) {
        await this.page.getByLabel('Overordnet').click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.UNDERORDNET) {
        await this.page.getByLabel('Underordnet').click();
      }
      await this.fillLanguageField(
        relation.inndelingskriterium,
        'Inndelingskriterium',
        ['Bokmål', 'Nynorsk', 'Engelsk'],
        false,
      );
    } else if (relation.relasjon === RelationTypeEnum.PARTITIV) {
      await this.page.getByLabel('Partitiv').click();
      await this.page.getByLabel('Nivå').click();
      if (relation.relasjonsType === RelationSubtypeEnum.ER_DEL_AV) {
        await this.page.getByLabel('Er del av').click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.OMFATTER) {
        await this.page.getByLabel('Omfatter').click();
      }
      await this.fillLanguageField(
        relation.inndelingskriterium,
        'Inndelingskriterium',
        ['Bokmål', 'Nynorsk', 'Engelsk'],
        false,
      );
    } else if (relation.relasjon === RelationTypeEnum.SE_OGSÅ) {
      await this.page.getByLabel('Se også').click();
    } else if (relation.relasjon === RelationTypeEnum.ERSTATTES_AV) {
      await this.page.getByLabel('Erstattes av').click();
    }
    await this.page.getByRole('dialog').getByRole('button', { name: 'Legg til relasjon' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Legg til relasjon' }).waitFor({ state: 'hidden' });
  }

  async clearFields(fields) {
    const removeBtn = this.page.getByRole('button', { name: 'Slett' });
    while ((await removeBtn.count()) > 0) {
      await removeBtn.first().click();
    }

    const clearBtn = this.page.getByRole('button', { name: 'Fjern alt' });
    while ((await clearBtn.count()) > 0) {
      await clearBtn.first().click();
    }

    // The table is replaced with a skeleton when loading, so wait for the table to be visible
    const relTable = getParentLocator(this.page.getByRole('cell', { name: 'Relasjon' }), 3);
    while ((await relTable.getByRole('row').count()) === 0 || (await relTable.getByRole('row').count()) > 1) {
      if ((await relTable.getByRole('row').count()) > 1) {
        await relTable.getByRole('row').last().getByRole('button', { name: 'Slett' }).click();
      } else {
        await this.page.waitForTimeout(100);
      }
    }

    await this.page
      .getByRole('group', { name: 'Begrepsstatus' })
      .locator(`input[type="radio"][value="http://publications.europa.eu/resource/authority/concept-status/DRAFT"]`)
      .click();

    await this.page.getByLabel('Major').fill('0');
    await this.page.getByLabel('Minor').fill('1');
    await this.page.getByLabel('Patch').fill('0');

    await this.page.getByLabel('Gyldig fra og med').clear();
    await this.page.getByLabel('Gyldig til og med').clear();
    await this.page.getByRole('checkbox', { name: 'E-post' }).uncheck();
    await this.page.getByRole('checkbox', { name: 'Telefonnummer' }).uncheck();

    await this.page.getByRole('textbox', { name: 'Forkortelse' }).clear();
    await clearCombobox(this.page, 'Hvem skal begrepet tildeles?');
    
    for (const field of fields.internal) {
      if (field.type === 'text_long' || field.type === 'text_short') {
        console.log(`[EDIT PAGE] Clearing internal field (text): ${field.label.nb}`);
        await this.page
          .getByRole('textbox', { name: field.label.nb as string })
          .clear();
      } else if (field.type === 'boolean') {
        console.log(`[EDIT PAGE] Clearing internal field (boolean): ${field.label.nb}`);
        const checkbox = this.page.getByRole('group', { name: field.label.nb as string }).getByRole('checkbox');
        if(await checkbox.isChecked()) {
          checkbox.uncheck();
        }         
      } else if (field.type === 'code_list') {
        await clearCombobox(this.page, field.label.nb as string);
      } 
    }
  }

  // Helpers
  async fillFormAndSave(concept: Concept, apiRequestContext, clearBeforeFill = false) {
    console.log('[EDIT PAGE] Filling anbefaltTerm...');
    await this.fillLanguageField(
      concept.anbefaltTerm.navn,
      'Anbefalt term Hjelp til utfylling',
      ['Engelsk'],
      clearBeforeFill,
    );
    console.log('[EDIT PAGE] Filling tillattTerm...');
    await this.fillLanguageField(
      concept.tillattTerm,
      'Tillatt term Hjelp til utfylling',
      ['Bokmål', 'Nynorsk', 'Engelsk'],
      clearBeforeFill,
    );
    console.log('[EDIT PAGE] Filling frarådetTerm...');
    await this.fillLanguageField(
      concept.frarådetTerm,
      'Frarådet term Hjelp til utfylling',
      ['Bokmål', 'Nynorsk', 'Engelsk'],
      clearBeforeFill,
    );

    // Add definition without target group
    console.log('[EDIT PAGE] Adding definition without target group...');
    await this.page.getByRole('button', { name: 'Uten målgruppe' }).click();
    await this.fillLanguageField(
      concept.definisjon?.tekst,
      'Definisjon Hjelp til utfylling',
      ['Bokmål', 'Nynorsk', 'Engelsk'],
      clearBeforeFill,
    );
    console.log('[EDIT PAGE] Selecting forholdTilKilde:', concept.definisjon?.kildebeskrivelse?.forholdTilKilde);
    await this.page
      .getByRole('group', { name: 'Forhold til kilde' })
      .getByLabel(relationToSourceText(concept.definisjon?.kildebeskrivelse?.forholdTilKilde))
      .click();
    if (concept.definisjon?.kildebeskrivelse?.forholdTilKilde !== 'egendefinert') {
      console.log('[EDIT PAGE] Adding kildebeskrivelse...');
      await this.page.getByRole('button', { name: 'Legg til kilde' }).click();
      await this.page.getByRole('textbox', { name: 'Kildebeskrivelse' }).fill('Kilde');
    }

    console.log('[EDIT PAGE] Clicking "Legg til definisjon"...');
    await this.page.getByRole('button', { name: 'Legg til definisjon' }).click();

    // Add remark
    console.log('[EDIT PAGE] Filling merknad...');
    await this.fillLanguageField(
      concept.merknad,
      'Merknad Anbefalt',
      ['Bokmål', 'Nynorsk', 'Engelsk'],
      clearBeforeFill,
    );

    // Example
    console.log('[EDIT PAGE] Filling eksempel...');
    await this.fillLanguageField(concept.eksempel, 'Eksempel', ['Bokmål', 'Nynorsk', 'Engelsk'], clearBeforeFill);

    // Select subject
    console.log('[EDIT PAGE] Selecting Fagområde...');
    await this.page.getByLabel('Fagområde (velg fra liste)').click({ clickCount: 2 });
    await this.page.getByLabel('Sprekkmunk').click();

    // Application
    console.log('[EDIT PAGE] Filling omfang...');
    await this.page.getByLabel('Beskrivelse').click();
    await this.page.getByLabel('Beskrivelse').fill(concept.omfang?.tekst ?? '');
    await this.page.getByLabel('Lenke til referanse').fill(concept.omfang?.uri ?? '');

    console.log('[EDIT PAGE] Selecting assigned user...');
    await this.page.getByRole('combobox', { name: 'Hvem skal begrepet tildeles?' }).click();
    await this.page.getByLabel('Avery Quokka').click();

    console.log('[EDIT PAGE] Filling abbreviatedLabel...');
    await this.page.getByRole('textbox', { name: 'Forkortelse' }).fill(concept.abbreviatedLabel);
    for (let i = 0; i < (concept.merkelapp?.length ?? 0); i++) {
      console.log(`[EDIT PAGE] Adding merkelapp: ${concept.merkelapp[i]}`);
      await this.page.getByLabel('Merkelapp').fill(concept.merkelapp[i]);
      await this.page.keyboard.press('Enter');
    }

    // Status
    console.log('[EDIT PAGE] Selecting statusURI:', concept.statusURI);
    await this.page
      .getByRole('group', { name: 'Begrepsstatus' })
      .locator(`input[type="radio"][value="${concept.statusURI}"]`)
      .click();

    // Version
    console.log('[EDIT PAGE] Filling version:', concept.versjonsnr);
    await this.page.getByLabel('Major').fill(`${concept.versjonsnr.major}`);
    await this.page.getByLabel('Minor').fill(`${concept.versjonsnr.minor}`);
    await this.page.getByLabel('Patch').fill(`${concept.versjonsnr.patch}`);

    if (concept.gyldigFom) {
      console.log('[EDIT PAGE] Filling gyldigFom:', concept.gyldigFom);
      await this.page.getByLabel('Gyldig fra og med').fill(concept.gyldigFom);
    }
    if (concept.gyldigTom) {
      console.log('[EDIT PAGE] Filling gyldigTom:', concept.gyldigTom);
      await this.page.getByLabel('Gyldig til og med').fill(concept.gyldigTom);
    }

    if (concept.kontaktpunkt?.harEpost) {
      console.log('[EDIT PAGE] Filling kontaktpunkt.harEpost:', concept.kontaktpunkt.harEpost);
      await this.page.getByRole('checkbox', { name: 'E-postadresse' }).check();
      await this.page.getByRole('textbox', { name: 'E-postadresse' }).fill(concept.kontaktpunkt.harEpost);
    }

    if (concept.kontaktpunkt?.harTelefon) {
      console.log('[EDIT PAGE] Filling kontaktpunkt.harTelefon:', concept.kontaktpunkt.harTelefon);
      await this.page.getByRole('checkbox', { name: 'Telefonnummer' }).check();
      await this.page.getByRole('textbox', { name: 'Telefonnummer' }).fill(concept.kontaktpunkt.harTelefon);
    }

    // Save concept
    console.log('[EDIT PAGE] Closing Nextjs portal issues if open...');
    await this.page.getByRole('button', { name: 'Collapse issues badge' }).click();
    console.log('[EDIT PAGE] Clicking "Lagre"...');
    await this.page.getByRole('button', { name: 'Lagre' }).click();
    console.log('[EDIT PAGE] Waiting for confirmation message...');
    await this.page.getByText('Endringene ble lagret.').waitFor({ state: 'visible' });
    console.log('[EDIT PAGE] Form filled and saved successfully.');
  }

  public async goto(id?) {
    await this.page.goto(id ? `${this.url}/${id}/edit` : `${this.url}/new`);
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder.disableRules('svg-img-alt').analyze();
    expect.soft(result.violations).toEqual([]);
  }

  public async checkPageTitleText() {
    await expect(this.pageTitleLocator()).toHaveText('');
  }

  public async checkPageDescriptionText() {
    await expect(this.pageDescriptionLocator()).toHaveText('');
  }

  public async checkIfNoConceptsExist() {
    const items = (await this.page.getByRole('link').all()).filter(async (link) => {
      (await link.getAttribute('href')).startsWith(this.url);
    });

    expect(items.length).toBe(0);
  }

  public async expectMenu() {
    await expect(this.page.getByRole('heading', { name: 'Innhold i skjema' })).toBeVisible({ timeout: 20000 });
    await expect(this.page.getByRole('list').getByText('Term *')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Definisjon *')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Merknad')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Fagområde')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Eksempel')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Verdiområde')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Relasjoner')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Interne opplysninger')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Begrepsstatus')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Versjon')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Gyldighetsperiode')).toBeVisible();
    await expect(this.page.getByRole('list').getByText('Kontaktinformasjon *')).toBeVisible();
  }

  async expectEditPageUrl(catalogId: string, datasetId: string) {
    await this.page.waitForURL(`/catalogs/${catalogId}/datasets/${datasetId}/edit`);
  }

  // Title field
  async expectTitleField(language: string, expectedValue: string) {
    const titleField = this.page.getByRole('group', { name: 'Tittel Hjelp til utfylling Må fylles ut' }).getByLabel(language);
    await expect(titleField).toBeVisible();
    await expect(titleField).toHaveValue(expectedValue);
  }

  async fillTitleField(value: any, open: string[], clear: boolean) {
    await this.fillLanguageField(value, 'Tittel Hjelp til utfylling Må fylles ut', open, clear);
  }

  // Description field
  async expectDescriptionField(language: string, expectedValue: string) {
    const descriptionField = this.page.getByRole('group', { name: 'Beskrivelse Hjelp til utfylling Må fylles ut' }).getByLabel(language);
    await expect(descriptionField).toBeVisible();
    await expect(descriptionField).toHaveValue(expectedValue);
  }

  async fillDescriptionField(value: LocalizedStrings, open: string[], clear: boolean) {
    await this.fillLanguageField(value, 'Beskrivelse Hjelp til utfylling Må fylles ut', open, clear);
  }

  // Access rights
  async selectAccessRights(option: 'none' | 'public' | 'restricted' | 'non-public') {
    const accessRightsGroup = this.page.getByRole("group", { name: "Tilgang Hjelp til utfylling Anbefalt" });
    const options = {
      'none': 'Ingen tilgangsrettighet valgt',
      'public': 'Allmenn tilgang',
      'restricted': 'Betinget tilgang',
      'non-public': 'Ikke-allmenn tilgang'
    };
    const radio = accessRightsGroup.getByLabel(options[option], { exact: true });
    await expect(radio).toBeVisible();
    await radio.check();
    await expect(radio).toBeChecked();
  }

  // Legal basis
  async clickAddLegalRestriction() {
    await this.page.getByRole('button', { name: 'Legg til skjermingshjemmel' }).click();
  }

  // Processing basis
  async clickAddLegalProcessing() {
    await this.page.getByRole('button', { name: 'Legg til behandlingsgrunnlag' }).click();
  }

  // Delivery basis
  async clickAddLegalAccess() {
    await this.page.getByRole('button', { name: 'Legg til utleveringshjemmel' }).click();
  }

  async fillUrlWithLabelModal(name: string, value: UriWithLabel, open: string[], clear: boolean) {
    const dialog = this.page.getByRole('dialog');
    await this.fillLanguageField(value.prefLabel, 'Tittel', open, clear, dialog);
    await dialog.getByLabel('Lenke').fill(value.uri);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  // Publication date
  async expectPublicationDateField() {
    const dateField = this.page.getByLabel('Utgivelsesdato');
    await expect(dateField).toBeVisible();
    return dateField;
  }

  async setPublicationDate(date: string) {
    const dateField = await this.expectPublicationDateField();
    // Convert ISO string to YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];
    await dateField.fill(formattedDate);
  }

  // Help buttons
  async expectHelpButtons() {
    const helpButtons = this.page.getByRole('button', { name: 'Hjelp til utfylling' });
    await expect(helpButtons).toHaveCount(7); // Title, Description, Access, Legal Basis, Processing Basis, Delivery Basis, Publication Date
  }

  // Field indicators
  async expectFieldIndicators() {
    const requiredTags = this.page.getByText('Må fylles ut');
    await expect(requiredTags).toHaveCount(2); // Title and Description are required

    const recommendedTags = this.page.getByText('Anbefalt');
    await expect(recommendedTags).toHaveCount(5); // Access, Legal Basis, Processing Basis, Delivery Basis, Publication Date are recommended
  }

  // Save button
  async clickSaveButton() {
    await this.page.getByRole('button', { name: 'Lagre' }).click();
    await this.page.getByText('Endringene ble lagret.').waitFor({ state: 'visible' });
  }

  // Cancel button
  async clickCancelButton() {
    await this.page.getByRole('button', { name: 'Avbryt' }).click();
  }

  // Theme section
  async selectEuDataTheme(theme: string) {
    const themeField = this.page.getByRole('combobox', { name: 'Datatema(er)' });
    await themeField.click();
    await this.page.getByRole('option', { name: theme, exact: true }).click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.press('Escape');
  }

  async selectLosTheme(theme: string) {
    const themeField = this.page.getByRole('combobox', { name: 'LOS-tema(er)' });
    await themeField.click();
    await this.page.getByRole('option', { name: theme, exact: true }).click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.press('Escape');
  }

  // Distribution section
  async clickAddDistribution() {
    await this.page.getByRole('button', { name: 'Legg til distribusjon' }).click();
  }

  async fillDistributionForm(data: {
    title: LocalizedStrings;
    description: LocalizedStrings;
    accessUrl: string;
    license: string;
    format: string;
  }) {
    const dialog = this.page.getByRole('dialog');
    await this.fillLanguageField(data.title, 'Tittel', ['Bokmål', 'Nynorsk', 'Engelsk'], false, dialog);
    await this.fillLanguageField(data.description, 'Beskrivelse', ['Bokmål', 'Nynorsk', 'Engelsk'], false, dialog);
    await dialog.getByLabel('Lenke').fill(data.accessUrl);
    await dialog.getByRole('group', { name: 'Lisens' }).getByRole('combobox').click();
    await dialog.getByRole('option', { name: data.license, exact: true }).click();
    await this.page.waitForTimeout(100);
    await dialog.getByLabel('Lenke').click();
    await dialog.getByRole('group', { name: 'Format' }).getByRole('combobox').click();
    await dialog.getByRole('group', { name: 'Format' }).getByPlaceholder('Søk').fill(data.format);
    await dialog.getByRole('option', { name: data.format, exact: true }).click();
    await this.page.waitForTimeout(100);
    await dialog.getByLabel('Lenke').click();
    await dialog.getByRole('button', { name: 'Legg til', exact: true }).click();
  }

  async checkLanguage(language: string) {
    await this.page.getByRole('group', { name: 'Språk' }).getByLabel(language).check();
  }

  async selectCoverageArea(value: string) {
    await this.page.getByRole('group', { name: 'Dekningsområde' }).getByRole('combobox').click();
    await this.page.getByRole('group', { name: 'Dekningsområde' }).getByPlaceholder('Søk').fill(value);
    await this.page.getByRole('option', { name: value }).click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.press('Escape');
  }

  // Details section
  async addPeriod(from: string | null, to: string | null) {
    await this.page.getByRole('button', { name: 'Legg til tidsperiode' }).click();
    const dialog = this.page.getByRole('dialog');
    const fromDateField = dialog.getByLabel('Fra');
    await expect(fromDateField).toBeVisible();
    await fromDateField.fill(from);
    const toDateField = dialog.getByLabel('Til');
    await expect(toDateField).toBeVisible();
    await toDateField.fill(to);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  async addLandingPage(url: string, clickAddButton: boolean = true) {
    if (clickAddButton) {
      await this.page.getByRole('button', { name: 'Legg til landingsside' }).click();
    }
    await this.page.getByLabel('Landingsside').fill(url);
  }

  async selectDatasetType(type: string) {

    const typeField = this.page.getByRole('group', { name: 'Type' }).getByRole('combobox');
    await typeField.click();
    await this.page.getByRole('option', { name: type }).click();
  }

  async selectProvenance(provenance: string) {
    const provenanceField = this.page.getByRole('combobox', { name: 'Proveniens' });
    await provenanceField.click();
    await this.page.getByRole('option', { name: provenance }).click();
  }

  async selectFrequency(frequency: string) {
    const frequencyField = this.page.getByRole('combobox', { name: 'Frekvens' });
    await frequencyField.click();
    await this.page.getByRole('option', { name: frequency }).click();
  }

  // Relations section
  async clickAddRelation() {
    await this.page.getByRole('button', { name: 'Legg til relasjon' }).click();
  }

  async clickAddRelatedResource() {
    await this.page.getByRole('button', { name: 'Legg til relaterte ressurser' }).click();
  }

  async fillRelationForm(data: {
    relationType: string;
    dataset: string;
  }) {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('group', { name: 'Relasjonstype' }).getByRole('combobox').click();
    await dialog.getByRole('option', { name: data.relationType }).click();
    await dialog.getByRole('group', { name: 'Dataset' }).getByRole('combobox').click();
    await dialog.getByRole('group', { name: 'Dataset' }).getByPlaceholder('Søk').fill(data.dataset);
    await dialog.getByRole('option', { name: data.dataset }).click();
    await this.page.waitForTimeout(100);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  async fillRelatedResourceForm(data: {
    prefLabel: LocalizedStrings;
    uri: string;
  }) {
    const dialog = this.page.getByRole('dialog');
    await this.fillLanguageField(data.prefLabel, 'Tittel', ['Bokmål', 'Nynorsk', 'Engelsk'], false, dialog);
    await dialog.getByLabel('Lenke').fill(data.uri);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  // Concept section
  async selectConcept(concept: string) {
    await this.page.getByRole('group', { name: 'Begreper Hjelp til utfylling Anbefalt' }).getByRole('combobox').click();
    await this.page.getByRole('group', { name: 'Begreper Hjelp til utfylling Anbefalt' }).getByPlaceholder('Søk').fill(concept);
    await this.page.getByRole('option', { name: concept }).click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.press('Escape');
  }

  async fillKeywords(keywords: LocalizedStrings) {
    await this.fillLanguageField(keywords, 'Emneord Hjelp til utfylling Anbefalt', ['Bokmål', 'Nynorsk', 'Engelsk'], false);
  }

  // Information Model section
  async selectInformationModel(model: string) {
    await this.page.getByRole('group', { name: 'Informasjonsmodell fra Data.norge.no' }).getByRole('combobox').click();
    await this.page.getByRole('group', { name: 'Informasjonsmodell fra Data.norge.no' }).getByPlaceholder('Søk').fill(model);
    await this.page.getByRole('option', { name: model }).click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.press('Escape');
  }

  async clickAddInformationModel() {
    await this.page.getByRole('button', { name: 'Legg til informasjonsmodell fra andre kilder' }).click();
  }

  async addInformationModelSource(data: {
    prefLabel: LocalizedStrings;
    uri: string;
    open: string[];
    clear: boolean;
  }) {
    // Wait for dialog to be visible
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    
    // Try the original locator with more specific waiting
    await this.fillLanguageField(data.prefLabel, 'Tittel', data.open, data.clear, dialog);
    await dialog.getByLabel('Lenke').fill(data.uri);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  // Contact Point section
  async clickAddContactPoint() {
    await this.page.getByRole('button', { name: 'Legg til kontaktpunkt' }).click();
  }

  async fillContactPointForm(data: {
    email: string;
    phone: string;
    url: string;
  }) {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('E-post').fill(data.email);
    await dialog.getByLabel('Telefonnummer').fill(data.phone);
    await dialog.getByLabel('URL').fill(data.url);
    await dialog.getByRole('button', { name: 'Legg til' }).click();
  }

  // Auto-save testing helpers
  async expectRestoreDialog() {
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Ulagrede endringer' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Gjenopprett' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Forkast' })).toBeVisible();
  }

  async clickRestoreButton() {
    await this.page.getByRole('button', { name: 'Gjenopprett' }).click();
    await expect(this.page.getByRole('dialog')).not.toBeVisible();
  }

  async clickDiscardButton() {
    await this.page.getByRole('button', { name: 'Forkast' }).click();
    await expect(this.page.getByRole('dialog')).not.toBeVisible();
  }

  async expectNoRestoreDialog() {
    await expect(this.page.getByRole('dialog')).not.toBeVisible();
  }

  async waitForAutoSaveToComplete() {
    // Wait a bit for auto-save to complete
    await this.page.waitForTimeout(1000);
  }
}
