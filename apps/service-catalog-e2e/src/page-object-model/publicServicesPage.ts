import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';

export default class PublicServicesPage {
  url: string;
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/public-services`;
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitle = () => this.page.getByRole('heading', { name: '' });
  pageDescription = () => this.page.getByText('');

  // Helpers
  async deleteItem(url: string) {
    await this.page.goto(url);
    await this.page.getByRole('button', { name: 'Slett' }).click();
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
    await expect(this.pageTitle()).toHaveText('');
  }

  public async checkPageDescriptionText() {
    await expect(this.pageDescription()).toHaveText('');
  }

  public async deleteAllPublicServices() {
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toEqual('Er du sikker på at du vil slette tjenesten?');
      await dialog.accept();
    });

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
      await this.deleteItem(items[0]);

      // Wait for the list to update after deletion
      await this.page.waitForTimeout(500); // Adjust the timeout based on your application's response time
      await this.goto();
    }
  }

  public async createPublicServices() {}
}
