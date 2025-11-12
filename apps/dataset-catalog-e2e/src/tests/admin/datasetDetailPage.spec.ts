import { DatasetToBeCreated } from "@catalog-frontend/types";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import DatasetDetailPage from "../../page-object-model/datasetDetailPage";
import {
  adminAuthFile,
  createDataset,
  uniqueString,
} from "../../utils/helpers";

const getRandomDataset = () => {
  // Create a random dataset
  const dataset: DatasetToBeCreated = {
    title: {
      nb: uniqueString("test_dataset_nb"),
      nn: uniqueString("test_dataset_nn"),
      en: uniqueString("test_dataset_en"),
    },
    description: {
      nb: uniqueString("test_dataset_description_nb"),
      nn: uniqueString("test_dataset_description_nn"),
      en: uniqueString("test_dataset_description_en"),
    },
    approved: false,
    contactPoints: [
      {
        email: "test@test.com",
        phone: "1234567890",
        url: "https://test.com",
      },
    ],
  };
  return dataset;
};

runTestAsAdmin(
  "should load dataset detail page with all elements",
  async ({
    datasetsPage,
    playwright,
  }: {
    datasetsPage: any;
    context: any;
    playwright: any;
  }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataset = getRandomDataset();
    const datasetId = await createDataset(apiRequestContext, dataset);

    const detailPage: DatasetDetailPage = datasetsPage.detailPage;

    // Navigate to the dataset detail page
    await datasetsPage.goto(process.env.E2E_CATALOG_ID);
    // Search for the dataset
    await datasetsPage.search(dataset.title.nb as string);
    await datasetsPage.verifyDatasetExists(dataset.title.nb as string);

    // Click on the dataset to go to detail page
    await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
    await datasetsPage.expectDatasetDetailPageUrl(
      process.env.E2E_CATALOG_ID,
      datasetId,
    );

    // Verify dataset details
    await detailPage.expectTitle(dataset.title.nb as string);
    await detailPage.expectDescription(dataset.description.nb as string);
    await detailPage.expectStatus("Utkast");
    await detailPage.expectPublicationStatus("Ikke publisert");

    // Verify contact point information
    await detailPage.expectContactPoint(
      dataset.contactPoints[0].email as any,
      dataset.contactPoints[0].phone as any,
      dataset.contactPoints[0].url as any,
    );

    // Verify dataset ID
    await detailPage.expectDatasetId(datasetId);

    // Verify language selector
    await detailPage.expectLanguageSelector();

    // Verify action buttons
    await detailPage.expectEditButton();
    await detailPage.expectDeleteButton();

    // Verify publish switch
    await detailPage.expectPublishSwitch();

    // Verify help button for publication status
    await detailPage.expectHelpButton("Publiseringstilstand");

    // Verify section headings
    await detailPage.expectSectionHeading("Beskrivelse");
    await detailPage.expectSectionHeading("Datasett-ID");
    await detailPage.expectSectionHeading("Publiseringstilstand");
    await detailPage.expectSectionHeading("Kontaktpunkt");
  },
);

runTestAsAdmin(
  "should delete dataset from detail page",
  async ({
    datasetsPage,
    playwright,
  }: {
    datasetsPage: any;
    context: any;
    playwright: any;
  }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataset = getRandomDataset();
    const datasetId = await createDataset(apiRequestContext, dataset);

    const detailPage: DatasetDetailPage = datasetsPage.detailPage;

    // Navigate to the dataset detail page
    await datasetsPage.goto(process.env.E2E_CATALOG_ID);
    // Search for the dataset
    await datasetsPage.search(dataset.title.nb as string);
    await datasetsPage.verifyDatasetExists(dataset.title.nb as string);
    await datasetsPage.clickDatasetByTitle(dataset.title.nb as string);
    await datasetsPage.expectDatasetDetailPageUrl(
      process.env.E2E_CATALOG_ID,
      datasetId,
    );

    // Delete the dataset
    await detailPage.clickDeleteButton();
    await detailPage.expectDeleteConfirmationDialog(dataset.title.nb as string);
    await detailPage.confirmDelete();

    // Verify we're back on the datasets page
    await expect(datasetsPage.page).toHaveURL(
      `/catalogs/${process.env.E2E_CATALOG_ID}/datasets`,
    );

    // Verify the dataset no longer exists
    await datasetsPage.verifyDatasetDoesNotExist(dataset.title.nb as string);
  },
);
