import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Service, ServiceToBeCreated } from '@catalog-frontend/types';
import { ALL_SERVICES } from '../data/services';
import { getParentLocator, getStatusText } from '../utils/helpers';

export default class ServicesPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/services`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');
  statusFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Tjenestestatus' });
  statusFilterCompletedLocator = () => this.page.getByLabel('Ferdigstilt');
  statusFilterDeprecatedLocator = () => this.page.getByLabel('Frarådet');
  statusFilterUnderDevelopmentLocator = () => this.page.getByLabel('Under utvikling');
  statusFilterWithdrawnLocator = () => this.page.getByLabel('Trukket tilbake');
  publishedStateFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Publiseringstilstand' });
  publishedStateFilterPublishedLocator = () => this.page.getByLabel('Publisert', { exact: true });
  publishedStateFilterNotPublishedLocator = () => this.page.getByLabel('Ikke publisert');
  searchInputLocator = () => this.page.getByPlaceholder('Søk etter tjeneste...');
  searchButtonLocator = () => this.page.getByRole('button', { name: 'Søk' });

  // Helpers
  async createService(service: ServiceToBeCreated) {
    console.log(`Create new service with title ${service.title.nb}`);
    await this.goto();

    // Name and description
    await this.page.getByRole('link', { name: 'Opprett ny tjeneste' }).click({ timeout: 5000 });
    await this.page.getByLabel('Navn på bokmål').fill(service.title.nb);
    await this.page.getByLabel('Navn på nynorsk').fill(service.title.nn);
    await this.page.getByLabel('Navn på engelsk').fill(service.title.en);
    await this.page.getByLabel('Beskrivelse på bokmål').fill(service.description.nb);
    await this.page.getByLabel('Beskrivelse på nynorsk').fill(service.description.nn);
    await this.page.getByLabel('Beskrivelse på engelsk').fill(service.description.en);

    // Produces relations
    for (let i = 0; i < service.produces.length; i++) {
      const result = service.produces[i];
      await this.page.getByRole('button', { name: 'Legg til relasjon' }).click();
      await this.page.locator(`input[name="produces\\[${i}\\]\\.title\\.nb"]`).fill(result.title.nb);
      await this.page.locator(`input[name="produces\\[${i}\\]\\.title\\.nn"]`).fill(result.title.nn);
      await this.page.locator(`input[name="produces\\[${i}\\]\\.title\\.en"]`).fill(result.title.en);
      await this.page.locator(`input[name="produces\\[${i}\\]\\.description\\.nb"]`).fill(result.description.nb);
      await this.page.locator(`input[name="produces\\[${i}\\]\\.description\\.nn"]`).fill(result.description.nn);
      await this.page.locator(`input[name="produces\\[${i}\\]\\.description\\.en"]`).fill(result.description.en);
    }

    // Contact point
    const contactPoint = service.contactPoints[0];
    await this.page.getByLabel('Kategori på bokmål').fill(contactPoint.category.nb);
    await this.page.getByLabel('Kategori på nynorsk').fill(contactPoint.category.nn);
    await this.page.getByLabel('Kategori på engelsk').fill(contactPoint.category.en);
    await this.page.getByLabel('E-post').fill(contactPoint.email);
    await this.page.getByLabel('Telefon').fill(contactPoint.telephone);
    await this.page.getByLabel('Kontaktside').fill(contactPoint.contactPage);

    // Status
    await this.page.getByRole('combobox').selectOption(service.status);

    // Homepage (website)
    await this.page.getByLabel('Lenke til hjemmeside').fill(service.homepage);

    // Save service
    await this.page.getByRole('button', { name: 'Lagre tjeneste' }).click();
    await expect(this.page.getByRole('button', { name: 'Lagre tjeneste' })).toBeHidden({ timeout: 5000 });
    console.log(`Saved service with title ${service.title.nb}`);
  }

  async deleteService(url: string) {
    await this.page.goto(url);
    await this.page.getByRole('button', { name: 'Slett' }).click();
    await expect(this.page.getByRole('button', { name: 'Slett' })).toBeHidden({ timeout: 5000 });
  }

  public async goto() {
    await this.page.goto(this.url);
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

  public async checkIfNoServicesExist() {
    const items = (await this.page.getByRole('link').all()).filter(async (link) => {
      (await link.getAttribute('href')).startsWith(this.url);
    });

    expect(items.length).toBe(0);
  }

  public async deleteAllServices() {
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toEqual('Er du sikker på at du vil slette tjenesten?');
      await dialog.accept();
    });

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Get the list of items
      const promises = (await this.page.getByRole('link').all()).map(async (link) => {
        const href = await link.getAttribute('href');
        return {
          value: href,
          include: href.includes(this.url) && !href.endsWith('/new'),
        };
      });
      const items = (await Promise.all(promises)).filter((l) => l.include).map((l) => l.value);

      if (items.length === 0) {
        console.log('All items deleted, the list is empty.');
        break;
      }

      // Log the number of items before deletion
      console.log(`Number of items before deletion: ${items.length}`);

      // Click the delete button for the first item
      await this.deleteService(items[0]);
      await this.goto();
    }
  }

  public async createServices() {
    for (const service of ALL_SERVICES) {
      await this.createService(service);
    }
    await this.goto();
    await this.expectSearchResults(ALL_SERVICES);
  }

  public async expectFiltersToBeVisible() {
    await expect(this.statusFilterHeaderLocator()).toBeVisible();
    await this.statusFilterHeaderLocator().click();

    await expect(this.statusFilterCompletedLocator()).toBeVisible();
    await expect(this.statusFilterDeprecatedLocator()).toBeVisible();
    await expect(this.statusFilterUnderDevelopmentLocator()).toBeVisible();
    await expect(this.statusFilterWithdrawnLocator()).toBeVisible();

    await expect(this.publishedStateFilterHeaderLocator()).toBeVisible();
    await this.publishedStateFilterHeaderLocator().click();

    await expect(this.publishedStateFilterPublishedLocator()).toBeVisible();
    await expect(this.publishedStateFilterNotPublishedLocator()).toBeVisible();
  }

  public async expectSearchResults(expected: Service[], notExpected: Service[] = []) {
    for (let i = 0; i < expected.length; i++) {
      await expect(this.page.getByText(expected[i].title.nb, { exact: true })).toBeVisible({ timeout: 5000 });
      await expect(this.page.getByText(expected[i].description.nb, { exact: true })).toBeVisible();

      const rowLocator = getParentLocator(this.page.getByText(expected[i].title.nb, { exact: true }), 4);
      await expect(rowLocator.filter({ hasText: getStatusText(expected[i].status) })).toBeVisible();
      await expect(
        rowLocator.filter({ hasText: expected[i].published ? 'Publisert' : 'Ikke publisert' }),
      ).toBeVisible();
    }

    for (let i = 0; i < notExpected.length; i++) {
      await expect(this.page.getByText(notExpected[i].title.nb, { exact: true })).toHaveCount(0);
    }
  }

  public async search(query: string) {
    await this.searchInputLocator().fill(query);
    await this.searchButtonLocator().click();
  }

  public async clearSearch() {
    await this.searchInputLocator().fill('');
    await this.searchButtonLocator().click();
  }

  public async clearFilters() {
    await this.statusFilterCompletedLocator().uncheck();
    await this.statusFilterDeprecatedLocator().uncheck();
    await this.statusFilterUnderDevelopmentLocator().uncheck();
    await this.statusFilterWithdrawnLocator().uncheck();
    await this.publishedStateFilterPublishedLocator().uncheck();
    await this.publishedStateFilterNotPublishedLocator().uncheck();
  }

  public async filterStatusCompleted() {
    if (!(await this.statusFilterCompletedLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterCompletedLocator().check();
  }

  public async filterStatusDeprecated() {
    if (!(await this.statusFilterDeprecatedLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterDeprecatedLocator().check();
  }

  public async filterStatusUnderDevelopment() {
    if (!(await this.statusFilterUnderDevelopmentLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterUnderDevelopmentLocator().check();
  }

  public async filterStatusWithDrawn() {
    if (!(await this.statusFilterWithdrawnLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterWithdrawnLocator().check();
  }

  public async filterPublished() {
    if (!(await this.publishedStateFilterPublishedLocator().isVisible())) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterPublishedLocator().check();
  }

  public async filterNotPublished() {
    if (!(await this.publishedStateFilterNotPublishedLocator().isVisible())) {
      await this.publishedStateFilterHeaderLocator().click();
    }
    await this.publishedStateFilterNotPublishedLocator().check();
  }
}
