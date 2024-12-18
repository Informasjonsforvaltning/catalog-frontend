import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import EditPage from './editPage';
import { Concept, Definisjon } from '@catalog-frontend/types';

export default class DetailPage {
  url: string;
  page: Page;
  editPage: EditPage;
  context: BrowserContext;
  accessibilityBuilder;

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

  public async deleteConcept() {
    await this.page.getByRole('button', { name: 'Slett' }).click();
    await expect(this.page.getByRole('button', { name: 'Slett' })).toBeHidden({ timeout: 5000 });
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
    if(def.kildebeskrivelse.forholdTilKilde === 'egendefinert') {
      return "Egendefinert";
    }
    return "";
  }

  getVersionText(concept: Concept) {
    return `${concept.versjonsnr.major}.${concept.versjonsnr.minor}.${concept.versjonsnr.patch}` 
  }

  async expectHeading(concept: Concept) {
    await expect(this.page.getByRole('heading', { name: concept.anbefaltTerm.navn.nb as string })).toBeVisible();
    
    const statusTag = this.page.getByText(this.getStatusText(concept.statusURI), { exact: true });
    await expect(statusTag).toBeVisible();
    
    const backgroundColor = await statusTag.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe(this.getStatusColor(concept.statusURI));
  }

  async expectActionButtons() {
    await expect(this.page.getByRole('button', { name: 'Rediger' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Slett' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Foreslå endring' })).toBeVisible();
  }

  async expectLanguageCombobox() {
    const languageCombobox = this.page.getByRole('combobox');
    const languageValue = await languageCombobox.inputValue();
    await expect(languageCombobox).toBeVisible();    
    await expect(languageValue).toBe('nb');
  }

  async expectLeftColumnContent(concept: Concept) {
    await expect(
      this.page
        .locator('div')
        .filter({
          hasText: new RegExp(`Definisjon:${concept.definisjon.tekst.nb as string}Kilde:${this.getDefinitionSourceText(concept.definisjon)}`),
        }).nth(1)
    ).toBeVisible();
  }

  async expectTabs() {
    await expect(this.page.getByRole('tab', { name: 'Kommentarer' })).toBeVisible();
    await expect(this.page.getByRole('tab', { name: 'Endringshistorikk' })).toBeVisible();
    await expect(this.page.getByRole('tab', { name: 'Versjoner' })).toBeVisible();
  }

  async expectRightColumnContent(concept: Concept) {
    await expect(this.page.getByRole('heading', { name: 'Begreps-ID'})).toBeVisible();
    await expect(this.page.getByText(/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/)).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Publiseringstilstand'})).toBeVisible();
    await expect(this.page.getByText(concept.erPublisert ? 'Publisert i felles datakatalog' : 'Ikke publisert')).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Versjon'})).toBeVisible();
    await expect(this.page.getByText(this.getVersionText(concept))).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Dato sist oppdatert'})).toBeVisible();
    await expect(this.page.getByText(this.getVersionText(concept))).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Opprettet', exact: true })).toBeVisible();
    await expect(this.page.getByText(this.getVersionText(concept))).toBeVisible();

    await expect(this.page.getByRole('heading', { name: 'Opprettet av', exact: true })).toBeVisible();
    await expect(this.page.getByText(this.getVersionText(concept))).toBeVisible();

    if(concept.kontaktpunkt?.harEpost || concept.kontaktpunkt?.harTelefon) {
      await expect(this.page.getByRole('heading', { name: 'Kontaktinformasjon for eksterne'})).toBeVisible();
      await expect(this.page.getByText(concept.kontaktpunkt.harEpost)).toBeVisible({ visible: Boolean(concept.kontaktpunkt.harEpost) });
      await expect(this.page.getByText(concept.kontaktpunkt.harTelefon)).toBeVisible({ visible: Boolean(concept.kontaktpunkt.harTelefon) });      
    }
  }

  public async expectDetails(concept: Concept) {
    await this.expectActionButtons();
    await this.expectLanguageCombobox();
    await this.expectHeading(concept);
    await this.expectLeftColumnContent(concept);
    await this.expectRightColumnContent(concept);
    await this.expectTabs();
  }
}
