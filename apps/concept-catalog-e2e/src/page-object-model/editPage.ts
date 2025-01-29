/* eslint-disable playwright/no-wait-for-timeout */
import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Concept, RelationSubtypeEnum, RelationTypeEnum, UnionRelation } from '@catalog-frontend/types';
import { ALL_RELATIONS } from '../data/relations';
import { clearCombobox, getParentLocator } from '../utils/helpers';

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
    await this.page.getByRole('group', { name: group }).first().waitFor({ state: 'visible' });

    if (clear) {
      const removeBtn = this.page
      .getByRole('group', { name: group })
      .getByRole('button', { name: 'Slett' });
      while(await removeBtn.count() > 0) {
        await removeBtn.first().click();
      }
    }

    if (open) {
      for (const lang of open) {
        await this.page.getByRole('group', { name: group }).getByRole('button', { name: lang }).click();
      }
    }

    if (Array.isArray(field?.nb) || Array.isArray(field?.nn) || Array.isArray(field?.en)) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
        await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn[i]);
        await this.page.keyboard.press('Enter');
      }

      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en[i]);
        await this.page.keyboard.press('Enter');
      }
    } else {
      if (field?.nb) {
        await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb);
      }
      if (field?.nn) {
        await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn);
      }
      if (field?.en) {
        await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en);
      }
    }
  }

  async addRelation(search, item, relation: UnionRelation) {
    await this.page.getByRole('button', { name: 'Legg til relasjon' }).click();
    if (relation.internal) {
      await this.page.getByText('Søk i egen katalog').click();
    } else {
      await this.page.getByText('Søk på data.norge.no').click();
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
      await this.page.getByLabel('Nivå' ).click();
      if (relation.relasjonsType === RelationSubtypeEnum.OVERORDNET) {
        await this.page.getByLabel('Overordnet').click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.UNDERORDNET) {
        await this.page.getByLabel('Underordnet').click();
      }
      await this.fillLanguageField(relation.inndelingskriterium, 'Inndelingskriterium', ['Bokmål', 'Nynorsk', 'Engelsk'], false);
    } else if (relation.relasjon === RelationTypeEnum.PARTITIV) {
      await this.page.getByLabel('Partitiv').click();
      await this.page.getByLabel('Nivå').click();
      if (relation.relasjonsType === RelationSubtypeEnum.ER_DEL_AV) {
        await this.page.getByLabel('Er del av').click();
      } else if (relation.relasjonsType === RelationSubtypeEnum.OMFATTER) {
        await this.page.getByLabel('Omfatter').click();
      }
      await this.fillLanguageField(relation.inndelingskriterium, 'Inndelingskriterium', ['Bokmål', 'Nynorsk', 'Engelsk'], false);
    } else if (relation.relasjon === RelationTypeEnum.SE_OGSÅ) {
      await this.page.getByLabel('Se også').click();
    } else if (relation.relasjon === RelationTypeEnum.ERSTATTES_AV) {
      await this.page.getByLabel('Erstattes av').click();
    }
    await this.page.getByRole('dialog').getByRole('button', { name: 'Legg til relasjon' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Legg til relasjon' }).waitFor({ state: 'hidden' });
  }

  async clearFields() {
    const removeBtn = this.page.getByRole('button', { name: 'Slett' });
    while(await removeBtn.count() > 0) {
      // eslint-disable-next-line playwright/no-force-option
      await removeBtn.first().click();
    }    

    const clearBtn = this.page.getByRole('button', { name: 'Fjern alt' });
    while(await clearBtn.count() > 0) {
      await clearBtn.first().click();
    }

    // The table is replaced with a skeleton when loading, so wait for the table to be visible
    const relTable = getParentLocator(this.page.getByRole('cell', { name: 'Relasjon' }), 3);
    while(await relTable.getByRole('row').count() === 0 || await relTable.getByRole('row').count() > 1) {
      if(await relTable.getByRole('row').count() > 1) {
        await relTable.getByRole('row').last().getByRole('button', { name: 'Slett' }).click();
      } else {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(100);
      }
    }
    
    await this.page
      .getByRole('group', { name: 'Begrepsstatus' })
      .locator(`input[type="radio"][value="http://publications.europa.eu/resource/authority/concept-status/DRAFT"]`)
      .click();

    await this.page.getByLabel('Major').fill('0')
    await this.page.getByLabel('Minor').fill('1')
    await this.page.getByLabel('Patch').fill('0')

    await this.page.getByLabel('Gyldig fra og med').clear();
    await this.page.getByLabel('Gyldig til og med').clear();
    await this.page.getByRole('checkbox', { name: 'E-post' }).uncheck();
    await this.page.getByRole('checkbox', { name: 'Telefonnummer' }).uncheck();
    
    await this.page.getByRole('textbox', { name: 'Forkortelse' }).clear();
    await this.page.getByRole('textbox', { name: 'Pet name' }).clear();
    await this.page.getByRole('textbox', { name: 'Adventure story' }).clear();

    await this.page.getByRole('group', { name: 'Has magical powers' }).getByRole('checkbox').uncheck();
    
    await clearCombobox(this.page, 'Hvem skal begrepet tildeles?');
    await clearCombobox(this.page, 'Planet type');    
  }

  // Helpers
  async fillFormAndSave(concept: Concept, clearBeforeFill = false) {
    if (clearBeforeFill) {
      await this.clearFields();
    }

    await this.fillLanguageField(
      concept.anbefaltTerm.navn,
      'Anbefalt term Hjelp til utfylling',
      ['Engelsk'], 
      clearBeforeFill,
    );
    await this.fillLanguageField(concept.tillattTerm, 'Tillatt term Hjelp til utfylling', ['Bokmål', 'Nynorsk', 'Engelsk'], clearBeforeFill);
    await this.fillLanguageField(concept.frarådetTerm, 'Frarådet term Hjelp til utfylling', ['Bokmål', 'Nynorsk', 'Engelsk'], clearBeforeFill);

    // Add definition without target group
    await this.page.getByRole('button', { name: 'Uten målgruppe' }).click();
    await this.fillLanguageField(
      concept.definisjon?.tekst,
      'Definisjon Hjelp til utfylling',
      ['Bokmål', 'Nynorsk', 'Engelsk'], 
      clearBeforeFill,
    );
    await this.page.getByRole('group', { name: 'Forhold til kilde' }).getByLabel('Egendefinert').click();
    await this.page.getByRole('button', { name: 'Legg til definisjon' }).click();

    // Add remark
    await this.fillLanguageField(concept.merknad, 'Merknad Anbefalt', ['Bokmål', 'Nynorsk', 'Engelsk'], clearBeforeFill);

    // Example
    await this.fillLanguageField(concept.eksempel, 'Eksempel', ['Bokmål', 'Nynorsk', 'Engelsk'], clearBeforeFill);

    // Select subject
    await this.page.getByLabel('FagområdeAnbefalt').click();
    await this.page.getByLabel('Sprekkmunk').click();

    // Application
    // We have to click on this field to make sure the previous combobox closes
    await this.page.getByLabel('Beskrivelse').click();
    await this.page.getByLabel('Beskrivelse').fill(concept.omfang?.tekst ?? '');
    await this.page.getByLabel('Lenke til referanse').fill(concept.omfang?.uri ?? '');

    // Add relation
    for (let i = 0; i < ALL_RELATIONS.length; i++) {
      await this.addRelation('bolig', 'boligKomisk presis bille iks', ALL_RELATIONS[i]);
    }

    // Internal fields
    await this.page.getByRole('combobox', { name: 'Hvem skal begrepet tildeles?' }).click();
    await this.page.getByLabel('Avery Quokka').click();
    await this.page.getByRole('textbox', { name: 'Forkortelse' }).fill(concept.abbreviatedLabel);
    await this.page.getByRole('textbox', { name: 'Pet name' }).fill('Fluffy');
    await this.page;
    this.page
      .getByRole('textbox', { name: 'Adventure story' })
      .fill(
        'Once upon a time, in a land of misty mountains and enchanted forests, a brave explorer named Ava set out on a quest to discover the mythical Crystal of Light. Through trials and triumphs, she learned the true power of courage and friendship.',
      );

    await this.page.getByRole('group', { name: 'Has magical powers' }).getByRole('checkbox').check();
    await this.page.getByRole('combobox', { name: 'Planet type' }).click();
    await this.page.getByLabel('Water planet').click();

    // Status
    await this.page
      .getByRole('group', { name: 'Begrepsstatus' })
      .locator(`input[type="radio"][value="${concept.statusURI}"]`)
      .click();

    // Version
    await this.page.getByLabel('Major').fill(`${concept.versjonsnr.major}`)
    await this.page.getByLabel('Minor').fill(`${concept.versjonsnr.minor}`)
    await this.page.getByLabel('Patch').fill(`${concept.versjonsnr.patch}`)

    if (concept.gyldigFom) {
      await this.page.getByLabel('Gyldig fra og med').fill(concept.gyldigFom);
    }
    if (concept.gyldigTom) {
      await this.page.getByLabel('Gyldig til og med').fill(concept.gyldigTom);
    }

    if (concept.kontaktpunkt?.harEpost) {
      await this.page.getByRole('checkbox', { name: 'E-postadresse' }).check();
      await await this.page.getByRole('textbox', { name: 'E-postadresse' }).fill(concept.kontaktpunkt.harEpost);
    }

    if (concept.kontaktpunkt?.harTelefon) {
      await this.page.getByLabel('Telefonnummer').check();
      await this.page.getByRole('textbox', { name: 'Telefonnummer' }).fill(concept.kontaktpunkt.harTelefon);
    }

    // Save concept
    await this.page.getByRole('button', { name: 'Lagre' }).click();
    await expect(this.page.getByRole('button', { name: 'Lagre' })).toBeDisabled({ timeout: 5000 });
    console.log(`Saved concept with title ${concept.anbefaltTerm.navn.nb}`);
  }

  public async goto(id?) {
    await this.page.goto(id ? `${this.url}/${id}/edit` : `${this.url}/new`);
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules('svg-img-alt')
      .analyze();
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
