import { test as setup, expect } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';
const writeFile = 'playwright/.auth/write.json';
const readFile = 'playwright/.auth/read.json';

setup('authenticate as user with admin role', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'BankID Bruk BankID-app, kodebrikke eller BankID på mobil " / "' }).click();
  await page.getByPlaceholder('11 siffer').click();
  await page.getByPlaceholder('11 siffer').fill(`${process.env.USER_ADMIN_PERSONAL_NUMBER}`);
  await page.getByPlaceholder('11 siffer').press('Enter');
  await page.getByRole('button', { name: 'BankID med app' }).click();
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').click();
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').fill(`${process.env.USER_ADMIN_CODE}`);
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').press('Enter');
  await page
    .frameLocator('iframe[title="BankID"]')
    .getByLabel('Ditt BankID-passord')
    .fill(`${process.env.USER_ADMIN_PASSWORD}`);
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Ditt BankID-passord').press('Enter');
  await page.waitForURL(`/${process.env.USER_ADMIN_CATALOG_ID}`, { timeout: 30000 });
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user with write role', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(`/${process.env.USER_WRITE_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
  await page.getByLabel('Personidentifikator (syntetisk)').fill('28871299902');
  await page.getByRole('button', { name: 'Autentiser' }).click();
  await page.waitForURL(`/${process.env.USER_WRITE_CATALOG_ID}`, { timeout: 30000 });
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: writeFile });
});

setup('authenticate as user with read role', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(`/${process.env.USER_READ_CATALOG_ID}`);
  await page.waitForURL('https://sso.staging.fellesdatakatalog.digdir.no/**');
  await page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
  await page.getByRole('link', { name: 'BankID Bruk BankID-app, kodebrikke eller BankID på mobil " / "' }).click();
  await page.getByPlaceholder('11 siffer').click();
  await page.getByPlaceholder('11 siffer').fill(`${process.env.USER_ADMIN_PERSONAL_NUMBER}`);
  await page.getByPlaceholder('11 siffer').press('Enter');
  await page.getByRole('button', { name: 'BankID med app' }).click();
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').click();
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').fill(`${process.env.USER_ADMIN_CODE}`);
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Engangskode').press('Enter');
  await page
    .frameLocator('iframe[title="BankID"]')
    .getByLabel('Ditt BankID-passord')
    .fill(`${process.env.USER_ADMIN_PASSWORD}`);
  await page.frameLocator('iframe[title="BankID"]').getByLabel('Ditt BankID-passord').press('Enter');
  await page.waitForURL(`/${process.env.USER_READ_CATALOG_ID}`, { timeout: 30000 });

  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible({ visible: false });
  await expect(page.getByPlaceholder('Søk')).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: readFile });
});
