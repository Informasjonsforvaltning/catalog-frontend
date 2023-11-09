import { test, expect } from '@playwright/test';
import { formatISO } from '../../../libs/utils/src/lib/date/format';

test.use({ storageState: 'apps/concept-catalog-e2e/playwright/.auth/admin.json' });

test('show detail info', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByPlaceholder('Søk').click();
  await page.getByPlaceholder('Søk').fill('fisk');
  await page.getByPlaceholder('Søk').press('Enter');

  await expect(page.getByRole('link', { name: 'Fisk' })).toBeVisible();
  await page.getByRole('link', { name: 'Fisk' }).click();

  await expect(page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fisk' })).toBeVisible();
  await expect(page.locator('span:near(h3:text("ID"))')).toContainText(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3,4}-[0-9a-f]{3,4}-[0-9a-f]{12}$/i,
  );
  await expect(page.locator('div').filter({ hasText: /^FiskGjeldendeBiologisk mangfold$/ })).toBeVisible();
  await expect(page.getByText('Biologisk mangfold', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Fisk er primært vannlevende virveldyr med gjeller, og med finner i stedet for be').first(),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Wikipedia' })).toBeVisible();
  await expect(page.getByText('Fisk og chips', { exact: true })).toBeVisible();
  await expect(page.getByText('Egendefinert', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Uthaug fisk tar vare på gamle tradisjoner innen foredling av sildeprodukter. Var').first(),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Uthaug fisk' })).toBeVisible();
  await expect(page.getByText('havbruk', { exact: true })).toBeVisible();
  await expect(page.getByText('Øret', { exact: true })).toBeVisible();
  await expect(page.getByText('FSK', { exact: true })).toBeVisible();
  await expect(page.getByText('laks', { exact: true })).toBeVisible();
  await expect(page.getByText('skalldyr', { exact: true })).toBeVisible();
  await expect(page.getByText('fisk@fellesdatakatalog.digdir.no', { exact: true })).toBeVisible();
  await expect(page.getByText('123456789', { exact: true })).toBeVisible();
  await expect(page.locator('span:near(h3:text("Opprettet av"))')).toContainText('LAMA LEDENDE');

  const createDate =
    formatISO(new Date().toISOString(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) ?? '';
  await expect(page.locator('span:near(h3:text("Sist oppdatert"))')).toContainText(createDate);
  await expect(page.locator('span:near(h3:text("Opprettet"))').first()).toContainText(createDate);
  await expect(page.locator('span:near(h3:text("Merkelapp"))')).toContainText('fauna');
  await expect(page.locator('span:near(h3:text("Versjon"))')).toContainText('1.1.2');
  await expect(page.getByText('Fra og med: 6. november 2023')).toBeVisible();
  await expect(page.getByText('Til og med: 31. desember 3000')).toBeVisible();
  await expect(page.getByText('Ikke publisert')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Mads Hansen og Ida Fladen kveles av surstrømming!' })).toBeVisible();
});

test('manage comments', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
});

test('show history', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);

  await page.getByRole('tab', { name: 'Endringshistorikk' }).click();
  await page.getByRole('button', { name: 'LAMA LEDENDE' }).click();
  await expect(page.getByText('replace - /versjonsnr/major1')).toBeVisible();
  await expect(page.getByText('replace - /versjonsnr/minor1')).toBeVisible();
  await expect(page.getByText('replace - /versjonsnr/patch2')).toBeVisible();
});

test('show versions', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByPlaceholder('Søk').click();
  await page.getByPlaceholder('Søk').fill('fisk');
  await page.getByPlaceholder('Søk').press('Enter');

  await expect(page.getByRole('link', { name: 'Fisk' })).toBeVisible();
  await page.getByRole('link', { name: 'Fisk' }).click();

  await page.getByRole('tab', { name: 'Versjoner' }).waitFor({ state: 'visible' });

  const currentUrl = await page.url().replace('http://localhost:4200', '');

  await page.getByRole('tab', { name: 'Versjoner' }).click();
  await expect(page.getByLabel('Versjoner').getByText('v1.1.2')).toBeVisible();
  await expect(page.getByLabel('Versjoner').getByText('Gjeldende')).toBeVisible();
  await expect(page.getByLabel('Versjoner').getByRole('link', { name: 'Fisk', exact: true })).toBeVisible();
  await expect(page.getByLabel('Versjoner').getByRole('link', { name: 'Fisk', exact: true })).toHaveAttribute(
    'href',
    currentUrl,
  );
});
