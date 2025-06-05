import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import EditPage from './editPage';
import { Concept, Definisjon, RelationSubtypeEnum, RelationTypeEnum, UnionRelation } from '@catalog-frontend/types';
import { formatISO } from '@catalog-frontend/utils';
import { relationToSourceText } from '../utils/helpers';

export default class DetailPage {
  url: string;
  page: Page;
  editPage: EditPage;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.editPage = new EditPage(page, context, accessibilityBuilder);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');

  public async goto(url) {
    await this.page.goto(url);
  }

  public async editConcept() {
    await this.page.getByRole('button', { name: 'Rediger' }).click();
    await this.editPage.expectMenu();
  }

  public async deleteConcept() {
    await this.page.getByRole('button', { name: 'Slett' }).click();
    await expect(this.page.getByRole('button', { name: 'Slett' })).toBeHidden({ timeout: 5000 });
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder.disableRules(['svg-img-alt', 'aria-toggle-field-name']).analyze();
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

  getStatusText(uri) {
    if (uri.includes('DRAFT')) {
      return 'utkast';
    } else if (uri.includes('CURRENT')) {
      return 'gjeldende';
    } else if (uri.includes('REJECTED')) {
      return 'avvist';
    }
    return 'ukjent';
  }

  getStatusColor(uri) {
    if (uri.includes('DRAFT')) {
      return 'rgb(250, 238, 194)';
    } else if (uri.includes('CURRENT')) {
      return 'rgb(209, 244, 225)';
    } else if (uri.includes('REJECTED')) {
      return 'rgb(244, 245, 246)';
    }
    return 'ukjent';
  }

  getDefinitionSourceText(def: Definisjon) {
    const text = relationToSourceText(def.kildebeskrivelse.forholdTilKilde);
    return def.kildebeskrivelse.forholdTilKilde === 'egendefinert' ? text : `${text}:`;
  }

  getVersionText(concept: Concept) {
    return `${concept.versjonsnr.major}.${concept.versjonsnr.minor}.${concept.versjonsnr.patch}`;
  }

  async expectHeading(concept: Concept) {
    await expect(this.page.getByRole('heading', { name: concept.anbefaltTerm.navn.nb as string })).toBeVisible();

    const statusTag = this.page.getByText(this.getStatusText(concept.statusURI), { exact: true });
    await expect(statusTag).toBeVisible();

    const backgroundColor = await statusTag.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBe(this.getStatusColor(concept.statusURI));
  }

  async expectActionButtons() {
    await expect(this.page.getByRole('button', { name: 'Rediger' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Slett' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Foreslå endring' })).toBeVisible();
  }

  async expectLanguageCombobox() {
    const languageCombobox = this.page.getByRole('combobox');
    await expect(languageCombobox).toBeVisible();
    await expect(languageCombobox).toHaveValue('nb');
  }

  async expectLeftColumnContent(concept: Concept) {
    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(
            `Definisjon:${concept.definisjon.tekst.nb as string}${this.getDefinitionSourceText(concept.definisjon)}`,
          ),
        })
        .first(),
    ).toBeVisible();

    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(`^Tillatt term:${concept.tillattTerm?.nb.join('')}$`),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.tillattTerm?.nb) });
 
    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(`^Frarådet term:${concept.frarådetTerm?.nb.join('')}$`),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.frarådetTerm?.nb) });

    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(`^Merknad:${concept.merknad.nb}$`),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.merknad.nb) });

    await expect(this.page.getByText(`Forkortelse:${concept.abbreviatedLabel}`)).toBeVisible({
      visible: Boolean(concept.abbreviatedLabel),
    });

    const relations: UnionRelation[] = [
      ...(concept.begrepsRelasjon?.map((rel) => ({ ...rel })) ?? []),
      ...(concept.seOgså
        ? concept.seOgså.map((concept) => ({
            relasjon: RelationTypeEnum.SE_OGSÅ,
            relatertBegrep: concept,
          }))
        : []),
      ...(concept.erstattesAv
        ? concept.erstattesAv.map((concept) => ({
            relasjon: RelationTypeEnum.ERSTATTES_AV,
            relatertBegrep: concept,
          }))
        : []),
    ];

    const internalRelations = [
      ...(concept.internBegrepsRelasjon
        ? concept.internBegrepsRelasjon.map((rel) => ({ ...rel, internal: true }))
        : []),
      ...(concept.internSeOgså
        ? concept.internSeOgså.map((concept) => ({
            relasjon: RelationTypeEnum.SE_OGSÅ,
            relatertBegrep: concept,
            internal: true,
          }))
        : []),
      ...(concept.internErstattesAv
        ? concept.internErstattesAv.map((concept) => ({
            relasjon: RelationTypeEnum.ERSTATTES_AV,
            relatertBegrep: concept,
            internal: true,
          }))
        : []),
    ];

    const allRelations: UnionRelation[] = [...relations, ...internalRelations];

    if (relations.length > 0) {
      await expect(this.page.getByRole('heading', { name: `Relaterte begreper (${relations.length})` })).toBeVisible();
    }

    if (internalRelations.length > 0) {
      await expect(
        this.page.getByRole('heading', { name: `Relaterte begreper - upubliserte (${internalRelations.length})` }),
      ).toBeVisible();
    }

    for (let i = 0; i < allRelations.length; i++) {
      const rel = allRelations[i];
      if (rel.relasjon === RelationTypeEnum.ASSOSIATIV) {
        await expect(
          this.page.getByText(`Assosiativ relasjon${rel.beskrivelse.nb}${rel.internal ? 'InternRel' : 'PublisertRel'}`),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.GENERISK) {
        const subtype = rel.relasjonsType === RelationSubtypeEnum.OVERORDNET ? 'Overordnet' : 'Underordnet';
        await expect(
          this.page.getByText(
            `Generisk relasjon${subtype} (Inndelingskriterium: ${rel.inndelingskriterium.nb})${rel.internal ? 'InternRel' : 'PublisertRel'}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.PARTITIV) {
        const subtype = rel.relasjonsType === RelationSubtypeEnum.OMFATTER ? 'Omfatter' : 'Er del av';
        await expect(
          this.page.getByText(
            `Partitiv relasjon${subtype} (Inndelingskriterium: ${rel.inndelingskriterium.nb})${rel.internal ? 'InternRel' : 'PublisertRel'}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.SE_OGSÅ) {
        await expect(this.page.getByText(`Se også${rel.internal ? 'InternRel' : 'PublisertRel'}`)).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
        await expect(this.page.getByText(`Erstattes av${rel.internal ? 'InternRel' : 'PublisertRel'}`)).toBeVisible();
      }
    }

    // TODO set internal fields using API
    // await expect(this.page.getByText('Adventure story:Once upon a time')).toBeVisible();

    // await expect(this.page.getByText('Has magical powers:Ja')).toBeVisible();

    // await expect(this.page.getByText('Pet name:Fluffy')).toBeVisible();
  }

  async expectCommentsTab() {
    const tab = this.page.getByRole('tab', { name: 'Kommentarer' });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(this.page.getByLabel('Legg til kommentar')).toBeVisible();
    await expect(this.page.getByText('Kommentarer (0)')).toBeVisible();
  }

  async expectHistoryTab() {
    const tab = this.page.getByRole('tab', { name: 'Endringshistorikk' });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(
      this.page
        .getByRole('button', {
          name: `LAMA LEDENDE ${formatISO(new Date().toISOString(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
        })
        .first(),
    ).toBeVisible();
  }

  async expectVersionTab({ anbefaltTerm: { navn }, versjonsnr, statusURI }: Concept) {
    const tab = this.page.getByRole('tab', { name: 'Versjoner' });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(
            `^Versjons-ID ([a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+)v${versjonsnr.major}\\.${versjonsnr.minor}\\.${versjonsnr.patch}${navn.nb}${this.getStatusText(statusURI)}$`,
          ),
        })
        .nth(2),
    ).toBeVisible();
  }

  async expectRightColumnContent(concept: Concept) {
    await expect(this.page.getByRole('heading', { name: 'Begreps-ID' })).toBeVisible();
    await expect(this.page.getByText(/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/)).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Publiseringstilstand' })).toBeVisible();
    await expect(
      this.page.getByText(concept.erPublisert ? 'Publisert i felles datakatalog' : 'Ikke publisert'),
    ).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Versjon' })).toBeVisible();
    await expect(this.page.getByText(this.getVersionText(concept))).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Gyldighetsperiode' })).toBeVisible({
      visible: Boolean(concept.gyldigFom || concept.gyldigTom),
    });
    await expect(
      this.page.getByText(
        formatISO(new Date(concept.gyldigFom).toISOString(), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) ?? '',
      ),
    ).toBeVisible({ visible: Boolean(concept.gyldigFom) });

    await expect(this.page.getByRole('heading', { name: 'Gyldighetsperiode' })).toBeVisible({
      visible: Boolean(concept.gyldigFom || concept.gyldigTom),
    });
    await expect(
      this.page.getByText(
        formatISO(new Date(concept.gyldigTom).toISOString(), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) ?? '',
      ),
    ).toBeVisible({ visible: Boolean(concept.gyldigTom) });

    // TODO use API
    // await expect(this.page.getByRole('heading', { name: 'Tildelt' })).toBeVisible();
    // await expect(this.page.getByText('Avery Quokka')).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Dato sist oppdatert' })).toBeVisible();
    await expect(
      this.page
        .getByText(
          formatISO(new Date().toISOString(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) ?? '',
        )
        .first(),
    ).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Opprettet', exact: true })).toBeVisible();
    await expect(
      this.page
        .getByText(
          formatISO(new Date().toISOString(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) ?? '',
        )
        .nth(1),
    ).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Opprettet av', exact: true })).toBeVisible();
    await expect(this.page.getByText('LAMA LEDENDE')).toBeVisible();

    if (concept.kontaktpunkt?.harEpost || concept.kontaktpunkt?.harTelefon) {
      await expect(this.page.getByRole('heading', { name: 'Kontaktinformasjon for eksterne' })).toBeVisible();
      await expect(this.page.getByText(concept.kontaktpunkt.harEpost)).toBeVisible({
        visible: Boolean(concept.kontaktpunkt.harEpost),
      });
      await expect(this.page.getByText(concept.kontaktpunkt.harTelefon)).toBeVisible({
        visible: Boolean(concept.kontaktpunkt.harTelefon),
      });
    }
  }

  public async expectDetails(concept: Concept) {
    await this.expectHeading(concept);
    await this.expectActionButtons();
    await this.expectLanguageCombobox();
    await this.expectLeftColumnContent(concept);
    await this.expectRightColumnContent(concept);
    await this.expectCommentsTab();
    await this.expectHistoryTab();
    await this.expectVersionTab(concept);
  }
}
