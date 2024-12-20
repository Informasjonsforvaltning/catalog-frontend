import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Concept, RelationSubtypeEnum, RelationTypeEnum, UnionRelation } from '@catalog-frontend/types';
import { ALL_RELATIONS } from '../data/relations';

export default class EditPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');

  async fillLanguageField(field, group, lang) {
    for (let i = 0; i < lang.length; i++) {
      await this.page.getByRole('group', { name: group }).getByRole('button', { name: lang[i] }).click();
    }

    if (Array.isArray(field?.nb) || Array.isArray(field?.nn) || Array.isArray(field?.en)) {
      for (let i = 0; i < (field?.nb?.length ?? 0); i++) {
        await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb[i]);
        await this.page.keyboard.press('Enter');
      }
      if (lang.includes('Nynorsk'))
        for (let i = 0; i < (field?.nn?.length ?? 0); i++) {
          await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn[i]);
          await this.page.keyboard.press('Enter');
        }
      for (let i = 0; i < (field?.en?.length ?? 0); i++) {
        await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en[i]);
        await this.page.keyboard.press('Enter');
      }
    } else if (field?.nb) {
      await this.page.getByRole('group', { name: group }).getByLabel('Bokmål').fill(field.nb);
    } else if (field?.nn) {
      await this.page.getByRole('group', { name: group }).getByLabel('Nynorsk').fill(field.nn);
    } else if (field?.en) {
      await this.page.getByRole('group', { name: group }).getByLabel('Engelsk').fill(field.en);
    }
  }

  async addRelation(search, item, relation: UnionRelation) {
    await this.page.getByRole('button', { name: 'Legg til relasjon' }).click();
    if(relation.internal) {
      await this.page.getByText('Søk i egen katalog').click();
    } else {
      await this.page.getByText('Søk på data.norge.no').click();
    }
    
    await this.page.getByRole('group', { name: 'Relatert begrep' }).getByRole('combobox').click();
    await this.page.locator('div').filter({ hasText: /^arrow upDismissFant ingen treffDismiss$/ }).locator('input').fill(search);
    await this.page.getByLabel(item).first().click();

    await this.page.getByRole('group', { name: 'Relasjon' }).getByRole('combobox').click();
    if(relation.relasjon === RelationTypeEnum.ASSOSIATIV) {
      await this.page.getByLabel('Assosiativ').click();
      await this.fillLanguageField(relation.beskrivelse, 'Relasjonsrolle', ['Bokmål', 'Nynorsk', 'Engelsk']);
    } else if(relation.relasjon === RelationTypeEnum.GENERISK) {
      await this.page.getByLabel('Generisk').click();
      await this.page.getByRole('group', { name: 'Nivå' }).getByRole('combobox').click();
      if(relation.relasjonsType === RelationSubtypeEnum.OVERORDNET) {
        await this.page.getByLabel('Overordnet').click();
      } else if(relation.relasjonsType === RelationSubtypeEnum.UNDERORDNET) {
        await this.page.getByLabel('Underordnet').click();
      }
      await this.fillLanguageField(relation.inndelingskriterium, 'Inndelingskriterium', ['Bokmål', 'Nynorsk', 'Engelsk']);
    } else if(relation.relasjon === RelationTypeEnum.PARTITIV) {
      await this.page.getByLabel('Partitiv').click();
      await this.page.getByRole('group', { name: 'Nivå' }).getByRole('combobox').click();
      if(relation.relasjonsType === RelationSubtypeEnum.ER_DEL_AV) {
        await this.page.getByLabel('Er del av').click();
      } else if(relation.relasjonsType === RelationSubtypeEnum.OMFATTER) {
        await this.page.getByLabel('Omfatter').click();
      }
      await this.fillLanguageField(relation.inndelingskriterium, 'Inndelingskriterium', ['Bokmål', 'Nynorsk', 'Engelsk']);
    } else if(relation.relasjon === RelationTypeEnum.SE_OGSÅ) {
      await this.page.getByLabel('Se også').click();
    } else if(relation.relasjon === RelationTypeEnum.ERSTATTES_AV) {
      await this.page.getByLabel('Erstattes av').click();
    }   
    await this.page.getByRole('dialog').getByRole('button', { name: 'Legg til relasjon' }).click();
  }

  // Helpers
  async fillFormAndSave(concept: Concept) {
    console.log(`Create new concept with title ${concept.anbefaltTerm.navn.nb}`);
    await this.page
      .getByRole('group', { name: 'Anbefalt term Anbefalt term' })
      .getByLabel('Bokmål')
      .fill(concept.anbefaltTerm.navn.nb as string);
    await this.page
      .getByRole('group', { name: 'Anbefalt term Anbefalt term' })
      .getByLabel('Nynorsk')
      .fill(concept.anbefaltTerm.navn.nn as string);

    await this.fillLanguageField(concept.tillattTerm, 'Tillat term Tillat term', ['Bokmål', 'Nynorsk', 'Engelsk']);
    await this.fillLanguageField(concept.frarådetTerm, 'Frarådet term Frarådet term', ['Bokmål', 'Nynorsk', 'Engelsk']);

    // Add definition without target group
    await this.page.getByRole('button', { name: 'Uten målgruppe' }).click();
    await this.fillLanguageField(concept.definisjon?.tekst, 'Definisjon Hjelpetekst Definisjon Må fylles ut', [
      'Nynorsk',
      'Engelsk',
    ]);
    await this.page.getByRole('group', { name: 'Forhold til kilde' }).getByLabel('Egen definert').click();
    await this.page.getByRole('button', { name: 'Legg til definisjon' }).click();

    // Add remark
    await this.fillLanguageField(concept.merknad, 'Merknad Anbefalt', ['Bokmål', 'Nynorsk', 'Engelsk']);

    // Example
    await this.fillLanguageField(concept.eksempel, 'Eksempel', ['Bokmål', 'Nynorsk', 'Engelsk']);

    // Select subject
    await this.page.getByRole('group', { name: 'Fagområde Fagområde Anbefalt' }).getByLabel('arrow down').click();
    await this.page.getByLabel('Sprekkmunk').click();

    // Application
    // We have to click on this field to make sure the previous combobox closes
    await this.page.getByLabel('Beskrivelse').click();
    await this.page.getByLabel('Beskrivelse').fill(concept.omfang?.tekst ?? '');
    await this.page.getByLabel('Lenke til referanse').fill(concept.omfang?.uri ?? '');
  
    // Add relation
    for(let i=0; i<ALL_RELATIONS.length; i++) {
      await this.addRelation('bolig', 'boligKomisk presis bille iks', ALL_RELATIONS[i]);  
    }
    
    // Internal fields
    await this.page.getByRole('combobox', { name: 'Hvem skal begrepet tildeles?' }).click();
    await this.page.getByLabel('Avery Quokka').click();
    await this.page.getByRole('textbox', { name: 'Forkortelse' }).fill(concept.abbreviatedLabel);    
    await this.page.getByRole('textbox', { name: 'Pet name' }).fill('Fluffy');
    await this.page
      this.page.getByRole('textbox', { name: 'Adventure story' })
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

    if (concept.gyldigFom) {
      await this.page.getByLabel('Gyldig fra og med').fill(concept.gyldigFom);
    }
    if (concept.gyldigTom) {
      await this.page.getByLabel('Gyldig til og med').fill(concept.gyldigTom);
    }

    if (concept.kontaktpunkt?.harEpost) {
      await this.page.getByLabel('E-post').check();
      await this.page
        .getByRole('group', { name: 'E-postadresse' })
        .getByRole('textbox')
        .fill(concept.kontaktpunkt.harEpost);
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
    const result = await this.accessibilityBuilder.analyze();
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
}
