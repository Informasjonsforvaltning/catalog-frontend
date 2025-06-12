import { DatasetToBeCreated, PublicationStatus } from '@catalog-frontend/types';
import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import DatasetsPage from '../../page-object-model/datasetsPage';
import { adminAuthFile, createDataset, uniqueString } from '../../utils/helpers';
import { dateStringToDate, formatDate } from '@catalog-frontend/utils';

const CATALOG_ID = '313422127';

const getRandomDataset = () => {
  // Create a random dataset
  const dataset: DatasetToBeCreated = {
    catalogId: CATALOG_ID,
    title: {
      nb: uniqueString('test_dataset_nb'),
      nn: uniqueString('test_dataset_nn'),
      en: uniqueString('test_dataset_en'),
    },
    description: {
      nb: uniqueString('test_dataset_description_nb'),
      nn: uniqueString('test_dataset_description_nn'),
      en: uniqueString('test_dataset_description_en'),
    },
    registrationStatus: PublicationStatus.DRAFT,
    contactPoint: [
      {
        email: 'test@test.com',
        hasTelephone: '1234567890',
        hasURL: 'https://test.com',
      },
    ],
  };
  return dataset;
};

runTestAsAdmin('should load datasets page', async ({ datasetsPage, playwright }: { datasetsPage: DatasetsPage, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataset = getRandomDataset();
  await createDataset(apiRequestContext, dataset);

  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectHasDatasets();
});

runTestAsAdmin('should show create dataset button', async ({ datasetsPage }: { datasetsPage: DatasetsPage }) => {
  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectCreateDatasetButtonVisible();
});

runTestAsAdmin('should have search input', async ({ datasetsPage }: { datasetsPage: DatasetsPage }) => {
  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectSearchInputVisible();
});

runTestAsAdmin('should show all filters', async ({ datasetsPage }: { datasetsPage: DatasetsPage }) => {
  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectAllFiltersVisible();
});

runTestAsAdmin('should show status filter', async ({ datasetsPage }: { datasetsPage: DatasetsPage }) => {
  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectStatusFilterVisible();
});

runTestAsAdmin('should show published filter', async ({ datasetsPage }: { datasetsPage: DatasetsPage }) => {
  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectPublishedFilterVisible();
});

runTestAsAdmin('should be able to search datasets', async ({ datasetsPage, playwright }: { datasetsPage: DatasetsPage, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  
  const datasets = Array.from({ length: 3 }).map((_) => getRandomDataset())
  for(const dataset of datasets) {
    await createDataset(apiRequestContext, dataset);
  }  

  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectSearchInputVisible();

  // Search for the dataset
  await datasetsPage.search(datasets[0].title.nb as string);
  // Verify the dataset exists in search results
  await datasetsPage.verifyDatasetExists(datasets[0].title.nb as string);
  await expect(datasetsPage.datasetCards).toHaveCount(1);

  // Verify dataset details
  await datasetsPage.verifyDatasetText(datasets[0].title.nb as string, 'Utkast');
  await datasetsPage.verifyDatasetText(datasets[0].title.nb as string, 'Ikke publisert');
  await datasetsPage.verifyDatasetText(datasets[0].title.nb as string, `Sist endret ${formatDate(dateStringToDate(new Date().toISOString()))}`);
});

runTestAsAdmin('should show no results when searching for non-existent dataset', async ({ datasetsPage, playwright }: { datasetsPage: DatasetsPage, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  
  const dataset = getRandomDataset();
  await createDataset(apiRequestContext, dataset);

  await datasetsPage.goto(CATALOG_ID);
  await datasetsPage.expectSearchInputVisible();
  await datasetsPage.search('non-existent-dataset-123');
  await expect(datasetsPage.noResultsLocator()).toBeVisible();
});