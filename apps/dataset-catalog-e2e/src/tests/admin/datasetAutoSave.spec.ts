import { DatasetToBeCreated } from "@catalog-frontend/types";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createDataset,
  uniqueString,
} from "../../utils/helpers";
import { accessRightPublic } from "@catalog-frontend/utils";
import EditPage from "../../page-object-model/datasetEditPage";
import DatasetDetailPage from "../../page-object-model/datasetDetailPage";

const createRandomDataset = async (playwright: any) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create a random dataset
  const dataset: DatasetToBeCreated = {
    title: {
      nb: uniqueString("title_nb"),
      nn: uniqueString("title_nn"),
      en: uniqueString("title_en"),
    },
    description: {
      nb: uniqueString("description_nb"),
      nn: uniqueString("description_nn"),
      en: uniqueString("description_en"),
    },
    accessRight: accessRightPublic.uri,
    legalBasisForRestriction: [
      {
        uri: "https://lovdata.no/dokument/NL/lov/2018-06-15-25",
        prefLabel: {
          nb: "Personvernloven § 8",
          nn: "Personvernloven § 8",
          en: "Personvernloven § 8",
        },
      },
    ],
    legalBasisForProcessing: [
      {
        uri: "https://lovdata.no/dokument/NL/lov/2018-06-15-25",
        prefLabel: {
          nb: "Personvernloven § 8",
          nn: "Personvernloven § 8",
          en: "Personvernloven § 8",
        },
      },
    ],
    legalBasisForAccess: [
      {
        uri: "https://lovdata.no/dokument/NL/lov/2018-06-15-25",
        prefLabel: {
          nb: "Personvernloven § 8",
          nn: "Personvernloven § 8",
          en: "Personvernloven § 8",
        },
      },
    ],
    approved: false,
    contactPoints: [
      {
        email: "test@example.com",
        phone: "+47 12 34 56 78",
        url: "https://example.com/contact",
      },
    ],
    distribution: [
      {
        title: {
          nb: uniqueString("title_dist_nb"),
          nn: uniqueString("title_dist_nn"),
          en: uniqueString("title_dist_en"),
        },
        description: {
          nb: uniqueString("description_dist_nb"),
          nn: uniqueString("description_dist_nn"),
          en: uniqueString("description_dist_en"),
        },
        accessURL: ["https://example.com/data"],
        license:
          "http://publications.europa.eu/resource/authority/licence/NLOD_2_0",
      },
    ],
    landingPage: ["https://example.com/dataset"],
    references: [],
    spatial: [],
    temporal: [],
  };

  const datasetId = await createDataset(apiRequestContext, dataset);
  return { id: datasetId, ...dataset };
};

runTestAsAdmin(
  "should show restore dialog after refresh when form has unsaved changes",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Change title to create unsaved changes
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for and verify the restore dialog appears
    await editPage.expectRestoreDialog();

    // Verify the dialog shows the correct dataset title
    await expect(page.getByText(newTitle.nb)).toBeVisible();
  },
);

runTestAsAdmin(
  "should restore form data when clicking restore button",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };
    const newDescription = {
      nb: uniqueString("new_description_nb"),
      nn: uniqueString("new_description_nn"),
      en: uniqueString("new_description_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Change title and description to create unsaved changes
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.fillDescriptionField(newDescription, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the form data was restored
    await editPage.expectTitleField("Bokmål", newTitle.nb);
    await editPage.expectTitleField("Nynorsk", newTitle.nn);
    await editPage.expectTitleField("Engelsk", newTitle.en);
    await editPage.expectDescriptionField("Bokmål", newDescription.nb);
    await editPage.expectDescriptionField("Nynorsk", newDescription.nn);
    await editPage.expectDescriptionField("Engelsk", newDescription.en);
  },
);

runTestAsAdmin(
  "should not show restore dialog after clicking discard button",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Change title to create unsaved changes
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click discard
    await editPage.expectRestoreDialog();
    await editPage.clickDiscardButton();

    // Verify the form shows original data (not the changed title)
    await editPage.expectTitleField("Bokmål", dataset.title.nb as string);

    // Refresh again - should not show restore dialog
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should show restore dialog multiple times until data is discarded",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Change title to create unsaved changes
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.waitForAutoSaveToComplete();

    // First refresh - should show restore dialog
    await page.reload();
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Second refresh - should show restore dialog again
    await page.reload();
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Third refresh - should show restore dialog again
    await page.reload();
    await editPage.expectRestoreDialog();
    await editPage.clickDiscardButton();

    // Fourth refresh - should NOT show restore dialog
    await page.reload();
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should auto-save modal dialog data and show restore dialog",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Open a modal dialog (legal restriction)
    await editPage.clickAddLegalRestriction();

    // Fill in modal data
    const modalData = {
      uri: "https://lovdata.no/dokument/NL/lov/test",
      prefLabel: {
        nb: uniqueString("legal_nb"),
        nn: uniqueString("legal_nn"),
        en: uniqueString("legal_en"),
      },
    };

    await editPage.fillUrlWithLabelModal(
      "Leg til skjermingshjemmel",
      modalData,
      ["Bokmål", "Nynorsk", "Engelsk"],
      false,
    );
    await editPage.waitForAutoSaveToComplete();

    // Don't close the modal, just refresh the page
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the modal data was restored by checking if the legal restriction was added
    await expect(page.getByText(modalData.prefLabel.nb)).toBeVisible();
  },
);

runTestAsAdmin(
  "should auto-save distribution modal data and restore correctly",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Open distribution modal
    await editPage.clickAddDistribution();

    // Fill in distribution form data
    const distributionData = {
      title: {
        nb: uniqueString("dist_title_nb"),
        nn: uniqueString("dist_title_nn"),
        en: uniqueString("dist_title_en"),
      },
      description: {
        nb: uniqueString("dist_desc_nb"),
        nn: uniqueString("dist_desc_nn"),
        en: uniqueString("dist_desc_en"),
      },
      accessUrl: "https://example.com/distribution",
      license: "Norsk lisens for offentlige data",
      format: "CSV",
    };

    await editPage.fillDistributionForm(distributionData);
    await editPage.waitForAutoSaveToComplete();

    // Don't close the modal, just refresh the page
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the distribution data was restored
    await expect(page.getByText(distributionData.title.nb)).toBeVisible();
  },
);

runTestAsAdmin(
  "should not show restore dialog when form has no unsaved changes",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Don't make any changes, just refresh the page
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should clear auto-save data after successful form submission",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Change title to create unsaved changes
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Fill in required fields
    await editPage.selectAccessRights("public");

    await editPage.clickAddLegalRestriction();
    await editPage.fillUrlWithLabelModal(
      "Leg til skjermingshjemmel",
      {
        uri: "https://lovdata.no/dokument/NL/lov/1",
        prefLabel: {
          nb: "Personvernloven § 1",
          nn: "Personvernloven § 1",
          en: "Personvernloven § 1",
        },
      },
      ["Bokmål", "Nynorsk", "Engelsk"],
      false,
    );

    await editPage.clickAddLegalProcessing();
    await editPage.fillUrlWithLabelModal(
      "Legg til behandlingsgrunnlag",
      {
        uri: "https://lovdata.no/dokument/NL/lov/2",
        prefLabel: {
          nb: "Personvernloven § 2",
          nn: "Personvernloven § 2",
          en: "Personvernloven § 2",
        },
      },
      ["Bokmål", "Nynorsk", "Engelsk"],
      false,
    );

    await editPage.clickAddLegalAccess();
    await editPage.fillUrlWithLabelModal(
      "Legg til utleveringshjemmel",
      {
        uri: "https://lovdata.no/dokument/NL/lov/3",
        prefLabel: {
          nb: "Personvernloven § 3",
          nn: "Personvernloven § 3",
          en: "Personvernloven § 3",
        },
      },
      ["Bokmål", "Nynorsk", "Engelsk"],
      false,
    );

    await editPage.setPublicationDate(new Date().toISOString());

    // Save the form
    await editPage.clickSaveButton();

    // Verify we're back on the details page
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await expect(page).toHaveURL(
      `/catalogs/${process.env.E2E_CATALOG_ID}/datasets/${dataset.id}`,
    );

    // Navigate back to edit page
    await detailPage.clickEditButton();

    // Refresh the page - should not show restore dialog since data was saved
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should auto-save keywords data and restore correctly",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newKeywords = {
      nb: [uniqueString("keyword_nb")],
      nn: [uniqueString("keyword_nn")],
      en: [uniqueString("keyword_en")],
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Fill in keywords data (similar to tillatt term in concepts)
    await editPage.fillKeywords(newKeywords);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the keywords data was restored
    await expect(page.getByText(newKeywords.nb[0])).toBeVisible();
    await expect(page.getByText(newKeywords.nn[0])).toBeVisible();
    await expect(page.getByText(newKeywords.en[0])).toBeVisible();
  },
);

runTestAsAdmin(
  "should discard auto-save data when changes are reverted to original state",
  async ({ page, datasetsPage, playwright }) => {
    const dataset = await createRandomDataset(playwright);
    const newTitle = {
      nb: uniqueString("new_title_nb"),
      nn: uniqueString("new_title_nn"),
      en: uniqueString("new_title_en"),
    };

    // Navigate to dataset details and click edit
    const detailPage: DatasetDetailPage = datasetsPage.detailPage;
    await detailPage.goto(process.env.E2E_CATALOG_ID as string, dataset.id);
    await detailPage.clickEditButton();

    // Initialize edit page
    const editPage: EditPage = datasetsPage.editPage;
    await editPage.expectEditPageUrl(
      process.env.E2E_CATALOG_ID as string,
      dataset.id,
    );

    // Step 1: Make initial changes and auto-save
    await editPage.fillTitleField(newTitle, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Step 2: Refresh and verify restore dialog appears
    await page.reload();
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Step 3: Revert changes back to original state
    await editPage.fillTitleField(dataset.title, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Step 4: Refresh again - should NOT show restore dialog since we reverted to original
    await page.reload();

    // Verify no restore dialog appears because changes were reverted to original state
    await editPage.expectNoRestoreDialog();

    // Verify the form shows the original data
    await editPage.expectTitleField("Bokmål", dataset.title.nb as string);
    await editPage.expectTitleField("Nynorsk", dataset.title.nn as string);
    await editPage.expectTitleField("Engelsk", dataset.title.en as string);
  },
);
