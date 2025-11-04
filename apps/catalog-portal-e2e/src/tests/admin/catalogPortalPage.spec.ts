/* eslint-disable playwright/no-standalone-expect */
import { runTestAsAdmin, expect } from '../../fixtures/basePage';

const orgId = process.env.E2E_CATALOG_ID;

const catalogTests = [
  {
    name: 'dataset catalog',
    locator: 'datasetCatalog',
    url: `https://datasettkatalog.staging.fellesdatakatalog.digdir.no/catalogs/${orgId}/datasets`,
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
];

catalogTests.forEach(({ name, locator, url }) => {
  runTestAsAdmin(`test navigation card for ${name}`, async ({ catalogPortalPage }) => {
    await catalogPortalPage.goto();
    await catalogPortalPage.verifyAndClickCatalogLink(locator, url);
  });
});
