import { test as setup, expect } from '@playwright/test';

const adminFile = 'apps/concept-catalog-e2e/playwright/.auth/admin.json';
const writeFile = 'apps/concept-catalog-e2e/playwright/.auth/write.json';
const readFile = 'apps/concept-catalog-e2e/playwright/.auth/read.json';

setup('authenticate as user with admin role', async ({ page }) => {
  await page.goto(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
  await page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_ADMIN_ID}`);
  await page.getByRole('button', { name: 'Autentiser' }).click();
  await page.waitForURL(`/${process.env.E2E_AUTH_ADMIN_CATALOG_ID}`, { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Importer' })).toBeVisible();
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // TODO sjekk om administrer menyen finnes

  // End of authentication steps.
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user with write role', async ({ page }) => {
  await page.goto(`/${process.env.E2E_AUTH_WRITE_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
  await page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_WRITE_ID}`);
  await page.getByRole('button', { name: 'Autentiser' }).click();
  await page.waitForURL(`/${process.env.E2E_AUTH_WRITE_CATALOG_ID}`, { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Importer' })).toBeVisible({ visible: false });
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: writeFile });
});

setup('authenticate as user with read role', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(`/${process.env.E2E_AUTH_READ_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
  await page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_READ_ID}`);
  await page.getByRole('button', { name: 'Autentiser' }).click();
  await page.waitForURL(`/${process.env.E2E_AUTH_READ_CATALOG_ID}`, { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible({ visible: false });
  await expect(page.getByRole('button', { name: 'Importer' })).toBeVisible({ visible: false });
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: readFile });
});
