import { DatasetToBeCreated, PublicationStatus } from '@catalog-frontend/types';
import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import DatasetsPage from '../../page-object-model/datasetsPage';
import DatasetDetailPage from '../../page-object-model/datasetDetailPage';
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

runTestAsAdmin('should load dataset detail page with all elements', async ({ datasetsPage, context, playwright }: { datasetsPage, context, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataset = getRandomDataset();
  const createdDataset = await createDataset(apiRequestContext, dataset);

  // Navigate to the dataset detail page
  await datasetsPage.goto(CATALOG_ID);
   // Search for the dataset
  await datasetsPage.search(dataset.title.nb as string);
  await datasetsPage.verifyDatasetExists(dataset.title.nb as string);
  
  // Click on the dataset to go to detail page
  await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
  await datasetsPage.expectDatasetDetailPageUrl(CATALOG_ID, createdDataset.id);

  // Verify dataset details
  await datasetsPage.detailPage.expectTitle(dataset.title.nb as string);
  await datasetsPage.detailPage.expectDescription(dataset.description.nb as string);
  await datasetsPage.detailPage.expectStatus('Utkast');
  await datasetsPage.detailPage.expectPublicationStatus('Ikke publisert');

  // Verify contact point information
  await datasetsPage.detailPage.expectContactPoint(
    dataset.contactPoint[0].email,
    dataset.contactPoint[0].hasTelephone,
    dataset.contactPoint[0].hasURL
  );

  // Verify dataset ID
  await datasetsPage.detailPage.expectDatasetId(createdDataset.id);

  // Verify language selector
  await datasetsPage.detailPage.expectLanguageSelector();

  // Verify action buttons
  await datasetsPage.detailPage.expectEditButton();
  await datasetsPage.detailPage.expectDeleteButton();

  // Verify publish switch
  await datasetsPage.detailPage.expectPublishSwitch();

  // Verify help button for publication status
  await datasetsPage.detailPage.expectHelpButton('Publiseringstilstand');

  // Verify section headings
  await datasetsPage.detailPage.expectSectionHeading('Beskrivelse');
  await datasetsPage.detailPage.expectSectionHeading('Datasett-ID');
  await datasetsPage.detailPage.expectSectionHeading('Publiseringstilstand');
  await datasetsPage.detailPage.expectSectionHeading('Kontaktinformasjon for eksterne');
});

runTestAsAdmin('should delete dataset from detail page', async ({ datasetsPage, context, playwright }: { datasetsPage, context, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataset = getRandomDataset();
  const createdDataset = await createDataset(apiRequestContext, dataset);

  // Navigate to the dataset detail page
  await datasetsPage.goto(CATALOG_ID);
  // Search for the dataset
  await datasetsPage.search(dataset.title.nb as string);
  await datasetsPage.verifyDatasetExists(dataset.title.nb as string);
  await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
  await datasetsPage.expectDatasetDetailPageUrl(CATALOG_ID, createdDataset.id);

  // Delete the dataset
  await datasetsPage.detailPage.clickDeleteButton();
  await datasetsPage.detailPage.expectDeleteConfirmationDialog(dataset.title.nb as string);
  await datasetsPage.detailPage.confirmDelete();

  // Verify we're back on the datasets page
  await expect(datasetsPage.page).toHaveURL(`/catalogs/${CATALOG_ID}/datasets`);

  // Verify the dataset no longer exists
  await datasetsPage.verifyDatasetDoesNotExist(dataset.title.nb as string);
});
