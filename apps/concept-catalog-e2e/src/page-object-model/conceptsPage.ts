import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { Concept } from '@catalog-frontend/types';
import { ALL_CONCEPTS } from '../data/concepts';
import DetailPage from './detailPage';
import EditPage from './editPage';

export default class ConceptsPage {
  url: string;
  page: Page;
  detailPage: DetailPage;
  editPage: EditPage;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.detailPage = new DetailPage(page, context, accessibilityBuilder);
    this.editPage = new EditPage(page, context, accessibilityBuilder);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole('heading', { name: '' });
  pageDescriptionLocator = () => this.page.getByText('');
  subjectFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Fagområde' });
  statusFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Begrepsstatus' });
  statusFilterDraftLocator = () => this.page.getByLabel('Utkast');
  statusFilterCandidateLocator = () => this.page.getByLabel('Kandidat');
  statusFilterWaitingLocator = () => this.page.getByLabel('Til godkjenning');
  statusFilterCurrentLocator = () => this.page.getByLabel('Gjeldende');
  statusFilterRetiredLocator = () => this.page.getByLabel('Foreldet');
  statusFilterRejectedLocator = () => this.page.getByLabel('Avvist');
  publishedStateFilterHeaderLocator = () => this.page.getByRole('button', { name: 'Publiseringstilstand' });
  publishedStateFilterPublishedLocator = () => this.page.getByLabel('Publisert', { exact: true });
  publishedStateFilterNotPublishedLocator = () => this.page.getByLabel('Ikke publisert');
  searchInputLocator = () => this.page.getByPlaceholder('Søk');
  searchButtonLocator = () => this.page.getByRole('button', { name: 'Søk' });
  noResultsLocator = () => this.page.getByText('Ditt søk ga ingen treff');

  async deletedAllConcepts() {
    try {
      await this.noResultsLocator().waitFor({ state: 'visible', timeout: 10000 });
      return await this.noResultsLocator().isVisible();
    } catch {
      return false;
    }
  };
 
  async deleteConcept(url: string) {
    await this.detailPage.goto(url);
    await this.detailPage.deleteConcept();
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

  public async checkIfNoConceptsExist() {
    const items = (await this.page.getByRole('link').all()).filter(async (link) => {
      (await link.getAttribute('href'))?.startsWith(this.url);
    });

    expect(items.length).toBe(0);
  }

  public async createConcepts() {
    for (const concept of ALL_CONCEPTS) {
      await this.goto();

      // Name and description
      await this.page.getByRole('link', { name: 'Nytt begrep' }).click({ timeout: 5000 });
      await this.editPage.fillFormAndSave(concept);
    }
    await this.goto();
    await this.expectSearchResults(ALL_CONCEPTS);
  }
  
  public async deleteAllConcepts() {
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toEqual('Er du sikker du ønsker å slette begrepet?');
      await dialog.accept();
    });

    // eslint-disable-next-line no-constant-condition
    while (!(await this.deletedAllConcepts())) {
      // Get the list of items
      const promises = (await this.page.getByRole('link').all()).map(async (link) => {
        const href = await link.getAttribute('href');
        return {
          value: href,
          include: href?.startsWith(this.url) && !href.endsWith('/new'),
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
      if(items[0]) {
        await this.deleteConcept(items[0]);
      }       
      await this.goto();
    }
  }

  public async expectFiltersToBeVisible() {
    await expect(this.statusFilterHeaderLocator()).toBeVisible();
    await this.statusFilterHeaderLocator().click();

    await expect(this.statusFilterCandidateLocator()).toBeVisible();
    await expect(this.statusFilterCurrentLocator()).toBeVisible();
    await expect(this.statusFilterDraftLocator()).toBeVisible();
    await expect(this.statusFilterRejectedLocator()).toBeVisible();
    await expect(this.statusFilterRetiredLocator()).toBeVisible();
    await expect(this.statusFilterWaitingLocator()).toBeVisible();

    await expect(this.publishedStateFilterHeaderLocator()).toBeVisible();
    await this.publishedStateFilterHeaderLocator().click();

    await expect(this.publishedStateFilterPublishedLocator()).toBeVisible();
    await expect(this.publishedStateFilterNotPublishedLocator()).toBeVisible();
  }

  public async expectSearchResults(expected: Concept[], notExpected: Concept[] = []) {
    for (let i = 0; i < expected.length; i++) {
      await expect(this.page.getByText(expected[i].anbefaltTerm.navn.nb as string, { exact: true })).toBeVisible({ timeout: 5000 });
      //await expect(this.page.getByText(expected[i].description.nb, { exact: true })).toBeVisible();

      // const rowLocator = getParentLocator(this.page.getByText(expected[i].title.nb, { exact: true }), 4);
      // await expect(rowLocator.filter({ hasText: getStatusText(expected[i].status) })).toBeVisible();
      // await expect(
      //   rowLocator.filter({ hasText: expected[i].published ? 'Publisert' : 'Ikke publisert' }),
      // ).toBeVisible();
    }

    for (let i = 0; i < notExpected.length; i++) {
      await expect(this.page.getByText(notExpected[i].anbefaltTerm.navn.nb as string, { exact: true })).toHaveCount(0);
    }
  }

  public async gotoDetailPage(concept: Concept) {
    await this.page.getByText(concept.anbefaltTerm.navn.nb as string, { exact: true }).click();
  };

  public async search(query: string) {
    await this.searchInputLocator().fill(query);
    await this.searchButtonLocator().click();
  }

  public async clearSearch() {
    await this.searchInputLocator().fill('');
    await this.searchButtonLocator().click();
  }

  public async clearFilters() {
    await this.statusFilterDraftLocator().uncheck();
    await this.statusFilterCandidateLocator().uncheck();
    await this.statusFilterWaitingLocator().uncheck();
    await this.statusFilterCurrentLocator().uncheck();
    await this.statusFilterRetiredLocator().uncheck();
    await this.statusFilterRejectedLocator().uncheck();
    
    await this.publishedStateFilterPublishedLocator().uncheck();
    await this.publishedStateFilterNotPublishedLocator().uncheck();
  }

  public async filterStatusDraft() {
    if (!(await this.statusFilterDraftLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterDraftLocator().check();
  }

  public async filterStatusCandidate() {
    if (!(await this.statusFilterCandidateLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterCandidateLocator().check();
  }

  public async filterStatusWaiting() {
    if (!(await this.statusFilterWaitingLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterWaitingLocator().check();
  }

  public async filterStatusRejected() {
    if (!(await this.statusFilterRejectedLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterRejectedLocator().check();
  }

  public async filterStatusRetired() {
    if (!(await this.statusFilterRetiredLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterRetiredLocator().check();
  }

  public async filterStatusCurrent() {
    if (!(await this.statusFilterCurrentLocator().isVisible())) {
      await this.statusFilterHeaderLocator().click();
    }
    await this.statusFilterCurrentLocator().check();
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
