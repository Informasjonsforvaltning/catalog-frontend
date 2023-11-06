import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('search', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByPlaceholder('Søk').click();
  await page.getByPlaceholder('Søk').fill('kaffe');
  await page.getByPlaceholder('Søk').press('Enter');

  await expect(page.getByText('kaffekop')).toBeVisible();
});

test('filter by status', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByRole('button', { name: 'Begrepsstatus' }).click();
  await page.getByLabel('Utkast').check();
  await expect(page.getByText('Test endringsloggen')).toBeVisible();
  await expect(page.getByText('Hvordan funker det')).toBeVisible();

  await page.getByLabel('Utkast').uncheck();
  await page.getByLabel('Kandidat').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Kandidat').uncheck();
  await page.getByLabel('Til godkjenning').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Til godkjenning').uncheck();
  await page.getByLabel('Gjeldende').check();
  await expect(page.getByText('midtbaneanker')).toBeVisible();
  await expect(page.getByText('TestImport')).toBeVisible();

  await page.getByLabel('Gjeldende').uncheck();
  await page.getByLabel('Foreldet').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page.getByLabel('Foreldet').uncheck();
  await page.getByLabel('Avvist').check();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  const bullet = page.getByRole('button', { name: 'Avvist' });
  await expect(bullet).toBeVisible();
  await bullet.click();
  await expect(bullet).toBeVisible({ visible: false });
});

test('filter by assigned', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByRole('button', { name: 'Tildelt' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Tildelt$/ })
    .getByRole('combobox')
    .click();
  await page.getByLabel('Kari Hansen').click();
  await expect(page.getByText('Ditt søk ga ingen treff')).toBeVisible();

  await page
    .locator('div')
    .filter({ hasText: /^Tildelt$/ })
    .getByRole('combobox')
    .click();
  await page.getByLabel('Stein Eidem').click();
  await expect(page.getByText('Test endringsloggen')).toBeVisible();

  const bullet = page.getByRole('button', { name: 'Stein Eidem', exact: true });
  await expect(bullet).toBeVisible();
  await bullet.click();
  await expect(bullet).toBeVisible({ visible: false });
});

test('filter by published', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByRole('button', { name: 'Publiseringstilstand' }).click();
  await page
    .locator('label')
    .filter({ hasText: /^Publisert$/ })
    .click();
  await expect(page.getByText('Test endringsloggen')).toBeVisible();

  await page
    .locator('label')
    .filter({ hasText: /^Publisert$/ })
    .click();
  await page.locator('label').filter({ hasText: 'Ikke publisert' }).click();
  await expect(page.getByText('Test endringsloggen')).toBeVisible({ visible: false });

  const bullet = page.getByRole('button', { name: 'Ikke publisert' });
  await expect(bullet).toBeVisible();
  await bullet.click();
  await expect(bullet).toBeVisible({ visible: false });
  await expect(page.getByText('Test endringsloggen')).toBeVisible();
});
