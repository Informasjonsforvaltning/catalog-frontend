import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('show detail info', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByPlaceholder('Søk').click();
  await page.getByPlaceholder('Søk').fill('kaffe');
  await page.getByPlaceholder('Søk').press('Enter');

  await expect(page.getByText('kaffekop')).toBeVisible();
  await page.getByText('kaffekop').click();
});

test('manage comments', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
});

test('show history', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
});

test('show versions', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
});
