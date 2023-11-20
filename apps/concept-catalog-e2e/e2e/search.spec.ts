import { test, expect } from '@playwright/test';
import { SearchPage } from './services/pages/search.page';

test.use({ storageState: 'apps/concept-catalog-e2e/playwright/.auth/read.json' });

test('search', async ({ page }) => {
  await page.goto(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`);
  await page.getByPlaceholder('Søk').click();
  await page.getByPlaceholder('Søk').fill('virveldyr');
  await page.getByPlaceholder('Søk').press('Enter');

  await expect(page.locator('a:near(h2)')).toContainText('Fisk');
});

test('filter by status', async ({ page }) => {
  const searchPage = new SearchPage(page);
  searchPage.goto('admin');

  searchPage.statusFilterClick();
  await page.getByLabel('Utkast').check();
  await expect(page.locator('a:near(h2)')).toHaveCount(1);
  await expect(page.locator('a:near(h2)')).toContainText('Gress');

  await page.getByLabel('Utkast').uncheck();
  await page.getByLabel('Kandidat').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Kandidat').uncheck();
  await page.getByLabel('Til godkjenning').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Til godkjenning').uncheck();
  await page.getByLabel('Gjeldende').check();
  await expect(page.locator('a:near(h2)')).toHaveCount(1);
  await expect(page.locator('a:near(h2)')).toContainText('Fisk');

  await page.getByLabel('Gjeldende').uncheck();
  await page.getByLabel('Foreldet').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Foreldet').uncheck();
  await page.getByLabel('Avvist').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  const bullet = page.getByRole('button', { name: 'Avvist' });
  await expect(bullet).toBeVisible();
  await bullet.click();
  await expect(bullet).toBeHidden();
  await expect(page.locator('a:near(h2)')).toHaveCount(2);
});

// test('filter by assigned', async ({ page }) => {
//   await page.goto(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`);
//   await page.getByRole('button', { name: 'Tildelt' }).click();
//   await page
//     .locator('div')
//     .filter({ hasText: /^Tildelt$/ })
//     .getByRole('combobox')
//     .click();
//   await page.getByLabel('LAMA LEDENDE').click();
//   await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

//   await page
//     .locator('div')
//     .filter({ hasText: /^Tildelt$/ })
//     .getByRole('combobox')
//     .click();
//   await page.getByLabel('Stein Eidem').click();
//   await expect(page.getByText('Test endringsloggen')).toBeVisible();

//   const bullet = page.getByRole('button', { name: 'Stein Eidem', exact: true });
//   await expect(bullet).toBeVisible();
//   await bullet.click();
//   await expect(bullet).toBeVisible({ visible: false });
// });

test('filter by published', async ({ page }) => {
  await page.goto(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`);
  await page.getByRole('button', { name: 'Publiseringstilstand' }).click();

  await page.locator('label').filter({ hasText: 'Publisert' }).click();
  await expect(page.getByText('Fisk')).toBeHidden();

  await page.locator('label').filter({ hasText: 'Publisert' }).click();
  await page.locator('label').filter({ hasText: 'Ikke publisert' }).click();
  await expect(page.getByText('Fisk')).toBeVisible();
  await expect(page.getByText('Gress')).toBeVisible();

  const bullet = page.getByRole('button', { name: 'Ikke publisert' });
  await expect(bullet).toBeVisible();
  await bullet.click();
  await expect(bullet).toBeHidden();
  await expect(page.getByText('Fisk')).toBeVisible();
  await expect(page.getByText('Gress')).toBeVisible();
});
