import { DataServiceToBeCreated } from '@catalog-frontend/types';
import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createDataService, uniqueString, dateStringToDate, formatDate } from '../../utils/helpers';
import { getRandomDataService } from '../../utils/dataService';

const getRandomDataServiceForTest = () => {
  // Create a random data service
  const dataService: DataServiceToBeCreated = {
    title: {
      nb: uniqueString('test_dataservice_nb'),
      nn: uniqueString('test_dataservice_nn'),
      en: uniqueString('test_dataservice_en'),
    },
    description: {
      nb: uniqueString('test_dataservice_description_nb'),
      nn: uniqueString('test_dataservice_description_nn'),
      en: uniqueString('test_dataservice_description_en'),
    },
    endpointUrl: 'https://api.example.com/data',
    keywords: {
      nb: ['test', 'data', 'service'],
      nn: ['test', 'data', 'tjeneste'],
      en: ['test', 'data', 'service'],
    },
    contactPoint: {
      name: {
        nb: 'Test Contact',
        nn: 'Test Kontakt',
        en: 'Test Contact',
      },
      email: 'test@example.com',
      phone: '+4712345678',
      url: 'https://example.com/contact',
    },
  };
  return dataService;
};

runTestAsAdmin('should load data services page', async ({ dataServicesPage, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataService = getRandomDataServiceForTest();
  await createDataService(apiRequestContext, dataService);

  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectHasDataServices();
});

runTestAsAdmin('should show create data service button', async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectCreateDataServiceButtonVisible();
});

runTestAsAdmin('should have search input', async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectSearchInputVisible();
});

runTestAsAdmin('should show all filters', async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectAllFiltersVisible();
});

runTestAsAdmin('should show status filter', async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectStatusFilterVisible();
});

runTestAsAdmin('should show published filter', async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectPublishedFilterVisible();
});

runTestAsAdmin('should be able to search data services', async ({ dataServicesPage, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataServices = Array.from({ length: 3 }).map((_) => getRandomDataServiceForTest());
  for (const dataService of dataServices) {
    await createDataService(apiRequestContext, dataService);
  }

  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectSearchInputVisible();

  // Search for the data service
  await dataServicesPage.search(dataServices[0].title.nb as string);
  // Verify the data service exists in search results
  await dataServicesPage.verifyDataServiceExists(dataServices[0].title.nb as string);
  await expect(dataServicesPage.dataServiceCards).toHaveCount(1);

  // Verify data service details
  await dataServicesPage.verifyDataServiceText(dataServices[0].title.nb as string, 
    dataServices[0].description.nb as string);
  await dataServicesPage.verifyDataServiceText(dataServices[0].title.nb as string, 'Ikke publisert');
  await dataServicesPage.verifyDataServiceText(
    dataServices[0].title.nb as string,
    `Sist endret ${formatDate(dateStringToDate(new Date().toISOString()))}`,
  );
});

runTestAsAdmin(
  'should show no results when searching for non-existent data service',
  async ({ dataServicesPage, playwright }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataService = getRandomDataServiceForTest();
    await createDataService(apiRequestContext, dataService);

    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    await dataServicesPage.expectSearchInputVisible();
    await dataServicesPage.search('non-existent-dataservice-123');
    await expect(dataServicesPage.noResultsLocator()).toBeVisible();
  },
);
