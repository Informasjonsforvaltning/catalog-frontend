import { DatasetToBeCreated, PublicationStatus } from '@catalog-frontend/types';
import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import DatasetDetailPage from '../../page-object-model/datasetDetailPage';
import { adminAuthFile, createDataset, uniqueString } from '../../utils/helpers';

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

  const detailPage: DatasetDetailPage = datasetsPage.detailPage;

  // Navigate to the dataset detail page
  await datasetsPage.goto(CATALOG_ID);
   // Search for the dataset
  await datasetsPage.search(dataset.title.nb as string);
  await datasetsPage.verifyDatasetExists(dataset.title.nb as string);
  
  // Click on the dataset to go to detail page
  await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
  await datasetsPage.expectDatasetDetailPageUrl(CATALOG_ID, createdDataset.id);

  // Verify dataset details
  await detailPage.expectTitle(dataset.title.nb as string);
  await detailPage.expectDescription(dataset.description.nb as string);
  await detailPage.expectStatus('Utkast');
  await detailPage.expectPublicationStatus('Ikke publisert');

  // Verify contact point information
  await detailPage.expectContactPoint(
    dataset.contactPoint[0].email,
    dataset.contactPoint[0].hasTelephone,
    dataset.contactPoint[0].hasURL
  );

  // Verify dataset ID
  await detailPage.expectDatasetId(createdDataset.id);

  // Verify language selector
  await detailPage.expectLanguageSelector();

  // Verify action buttons
  await detailPage.expectEditButton();
  await detailPage.expectDeleteButton();

  // Verify publish switch
  await detailPage.expectPublishSwitch();

  // Verify help button for publication status
  await detailPage.expectHelpButton('Publiseringstilstand');

  // Verify section headings
  await detailPage.expectSectionHeading('Beskrivelse');
  await detailPage.expectSectionHeading('Datasett-ID');
  await detailPage.expectSectionHeading('Publiseringstilstand');
  await detailPage.expectSectionHeading('Kontaktinformasjon for eksterne');
});

runTestAsAdmin('should delete dataset from detail page', async ({ datasetsPage, context, playwright }: { datasetsPage, context, playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const dataset = getRandomDataset();
  const createdDataset = await createDataset(apiRequestContext, dataset);

  const detailPage: DatasetDetailPage = datasetsPage.detailPage;

  // Navigate to the dataset detail page
  await datasetsPage.goto(CATALOG_ID);
  // Search for the dataset
  await datasetsPage.search(dataset.title.nb as string);
  await datasetsPage.verifyDatasetExists(dataset.title.nb as string);
  await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
  await datasetsPage.expectDatasetDetailPageUrl(CATALOG_ID, createdDataset.id);

  // Delete the dataset
  await detailPage.clickDeleteButton();
  await detailPage.expectDeleteConfirmationDialog(dataset.title.nb as string);
  await detailPage.confirmDelete();

  // Verify we're back on the datasets page
  await expect(datasetsPage.page).toHaveURL(`/catalogs/${CATALOG_ID}/datasets`);

  // Verify the dataset no longer exists
  await datasetsPage.verifyDatasetDoesNotExist(dataset.title.nb as string);
});
