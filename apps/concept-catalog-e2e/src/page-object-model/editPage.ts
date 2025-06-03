import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Concept, RelationSubtypeEnum, RelationTypeEnum, UnionRelation } from '@catalog-frontend/types';
import { clearCombobox, getFields, getParentLocator, relationToSourceText } from '../utils/helpers';

export default class EditPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');

  async fillLanguageField(field, group, open, clear) {
    console.log(`[fillLanguageField] group: ${group}, open: ${JSON.stringify(open)}, clear: ${clear}`);
    await this.page.getByRole('group', { name: group }).first().waitFor({ state: 'visible' });

    if (clear) {
      console.log(`[fillLanguageField] Clearing existing values for group: ${group}`);
      const removeBtn = this.page.getByRole('group', { name: group }).getByRole('button', { name: 'Slett' });
      while ((await removeBtn.count()) > 0) {
        await removeBtn.first().click();
      }
    }

    if (open) {
      for (const lang of open) {
        console.log(`[fillLanguageField] Opening language: ${lang} in group: ${group}`);
        await this.page.getByRole('group', { name: group }).getByRole('button', { name: lang }).click();
      }
    }

    if (Array.isArray(field?.nb) || Array.isArray(field?.nn) || Array.isArray(field?.en)) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Bokmål [${i}]: ${field.nb[i]}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Nynorsk [${i}]: ${field.nn[i]}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        console.log(`[fillLanguageField] Filling Engelsk [${i}]: ${field.en[i]}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en[i]);
        await this.page.keyboard.press('Enter');
      }
    } else {
      if (field?.nb) {
        console.log(`[fillLanguageField] Filling Bokmål: ${field.nb}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb);
      }
      if (field?.nn) {
        console.log(`[fillLanguageField] Filling Nynorsk: ${field.nn}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn);
      }
      if (field?.en) {
        console.log(`[fillLanguageField] Filling Engelsk: ${field.en}`);
        await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en);
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
    const fields = await getFields(apiRequestContext);
    
    console.log('[EDIT PAGE] fillFormAndSave called with clearBeforeFill:', clearBeforeFill);
    if (clearBeforeFill) {
      console.log('[EDIT PAGE] Clearing all fields before filling...');
      await this.clearFields(fields);
    }

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

    // Internal fields
    console.log('[EDIT PAGE] Filling interneFelt...');    
    for (const field of fields.internal) {
      if (concept.interneFelt[field.id]) {
        if (field.type === 'text_long' || field.type === 'text_short') {
          console.log(`[EDIT PAGE] Filling internal field (text): ${field.label.nb} = ${concept.interneFelt[field.id].value}`);
          await this.page
            .getByRole('textbox', { name: field.label.nb as string })
            .fill(concept.interneFelt[field.id].value);
        } else if (field.type === 'boolean') {
          console.log(`[EDIT PAGE] Setting internal field (boolean): ${field.label.nb} = ${concept.interneFelt[field.id].value}`);
          const checkbox = this.page.getByRole('group', { name: field.label.nb as string }).getByRole('checkbox');
          if(concept.interneFelt[field.id].value === 'true' && !(await checkbox.isChecked())) {
            await checkbox.check();
          }        
        }
      }
    }

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
}
