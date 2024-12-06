/* eslint-disable playwright/no-standalone-expect */
import { runTestAsAdmin, expect } from '../../fixtures/basePage';

const orgId = process.env.E2E_CATALOG_ID;

const catalogTests = [
  {
    name: 'dataset catalog',
    locator: 'datasetCatalog',
    url: `https://registrering.staging.fellesdatakatalog.digdir.no/catalogs/${orgId}/datasets`,
  },
  {
    name: 'data service catalog',
    locator: 'dataServiceCatalog',
    url: `https://dataservice-catalog.staging.fellesdatakatalog.digdir.no/${orgId}`,
  },
  {
    name: 'concept catalog',
    locator: 'conceptCatalog',
    url: `https://begrepskatalog.staging.fellesdatakatalog.digdir.no/catalogs/${orgId}/concepts`,
  },
  {
    name: 'service catalog',
    locator: 'serviceCatalog',
    url: `https://service-catalog.staging.fellesdatakatalog.digdir.no/catalogs/${orgId}/services`,
  },
  {
    name: 'public service catalog',
    locator: 'publicServiceCatalog',
    url: `https://service-catalog.staging.fellesdatakatalog.digdir.no/catalogs/${orgId}/public-services`,
  },
  {
    name: 'records of processing activities',
    locator: 'recordsOfProcessingActivities',
    url: `https://registrering-protokoll.staging.fellesdatakatalog.digdir.no/${orgId}`,
  },
];

runTestAsAdmin('test breadcrumb navigation', async ({ catalogPortalPage }) => {
  await catalogPortalPage.goto();

  const breadcrumb = catalogPortalPage.termsOfUse();
  await expect(breadcrumb).toBeVisible();

  await breadcrumb.click();
  await expect(catalogPortalPage.page).toHaveURL(
    'https://registrering.staging.fellesdatakatalog.digdir.no/terms-and-conditions/313422127',
  ); //Bytt ut denne med nye catalog-portal når det er prodsatt
});

runTestAsAdmin('verify terms and conditions', async ({ catalogPortalPage }) => {
  await catalogPortalPage.goto();

  const termsLink = catalogPortalPage.termsOfUse();
  await expect(termsLink).toBeVisible();
});

catalogTests.forEach(({ name, locator, url }) => {
  runTestAsAdmin(`test navigation card for ${name}`, async ({ catalogPortalPage }) => {
    await catalogPortalPage.goto();
    await catalogPortalPage.verifyAndClickCatalogLink(locator, url);
  });
});
