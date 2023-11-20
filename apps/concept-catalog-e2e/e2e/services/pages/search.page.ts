import { type Locator, type Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly statusFilterAcoordionItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusFilterAcoordionItem = page.getByRole('button', { name: 'Begrepsstatus' });
  }

  async goto(role: 'admin' | 'write' | 'read') {
    if (role === 'admin') {
      await this.page.goto(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`);
    } else if (role === 'write') {
      await this.page.goto(`/${process.env.E2E_AUTH_WRITE_CATALOG_ID}`);
    } else {
      await this.page.goto(`/${process.env.E2E_AUTH_READ_CATALOG_ID}`);
    }
  }

  async statusFilterClick() {
    await this.statusFilterAcoordionItem.click();
  }
}
