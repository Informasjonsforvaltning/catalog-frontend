import { Concept } from "@catalog-frontend/types";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createConcept,
  getFields,
  getUsers,
  uniqueString,
} from "../../utils/helpers";
import EditPage from "../../page-object-model/editPage";
import DetailPage from "../../page-object-model/detailPage";

const createRandomConcept = async (playwright) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create a random concept
  const concept: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: uniqueString("term_nb"),
        nn: uniqueString("term_nn"),
        en: uniqueString("term_en"),
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: uniqueString("def_nb"),
        nn: uniqueString("def_nn"),
        en: uniqueString("def_en"),
      },
      kildebeskrivelse: {
        forholdTilKilde: "basertPaaKilde",
        kilde: [
          {
            tekst: "Test kilde",
            uri: "https://test.kilde.no",
          },
        ],
      },
    },
    kontaktpunkt: {
      harEpost: "test@example.com",
      harTelefon: "123456789",
    },
    versjonsnr: { major: 1, minor: 0, patch: 0 },
    merknad: {
      nb: uniqueString("merknad_nb"),
      nn: uniqueString("merknad_nn"),
      en: uniqueString("merknad_en"),
    },
    merkelapp: ["test-label"],
    eksempel: {
      nb: uniqueString("eksempel_nb"),
      nn: uniqueString("eksempel_nn"),
      en: uniqueString("eksempel_en"),
    },
    fagområde: null,
    fagområdeKoder: null,
    omfang: {
      tekst: "Test omfang",
      uri: "https://test.omfang.no",
    },
    tillattTerm: {
      nb: [uniqueString("tillatt_nb")],
      nn: [uniqueString("tillatt_nn")],
      en: [uniqueString("tillatt_en")],
    },
    frarådetTerm: {
      nb: [uniqueString("frarådet_nb")],
      nn: [uniqueString("frarådet_nn")],
      en: [uniqueString("frarådet_en")],
    },
    gyldigFom: "2024-01-01",
    gyldigTom: null,
    seOgså: [],
    internBegrepsRelasjon: [],
    internSeOgså: [],
    internErstattesAv: [],
    erstattesAv: [],
    statusURI:
      "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
    assignedUser: null,
    begrepsRelasjon: [],
    interneFelt: null,
    abbreviatedLabel: "TEST",
  };

  const id = await createConcept(apiRequestContext, concept);
  return { ...concept, id };
};

runTestAsAdmin(
  "should show restore dialog after refresh when concept form has unsaved changes",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept(); //TODO here

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Change anbefalt term to create unsaved changes
    await editPage.fillAnbefaltTermField(newTerm, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for and verify the restore dialog appears
    await editPage.expectRestoreDialog();

    // Verify the dialog shows the correct concept term
    await editPage.expectRestoreDialogShowsTerm(newTerm.nb);
  },
);

runTestAsAdmin(
  "should restore concept form data when clicking restore button",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };
    const newDefinition = {
      nb: uniqueString("new_def_nb"),
      nn: uniqueString("new_def_nn"),
      en: uniqueString("new_def_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Change anbefalt term and definition to create unsaved changes
    await editPage.fillAnbefaltTermField(newTerm, [], false);
    await editPage.editDefinition(concept.definisjon, "uten målgruppe");
    await editPage.fillDefinitionField(newDefinition, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();
    await editPage.expectRestoreSuccessMessage();

    // Verify the form data was restored
    await editPage.expectAnbefaltTermField("Bokmål", newTerm.nb);
    await editPage.expectAnbefaltTermField("Nynorsk", newTerm.nn);
    await editPage.expectAnbefaltTermField("Engelsk", newTerm.en);
    await editPage.expectDefinitionCard(
      { ...concept.definisjon, tekst: newDefinition },
      "uten målgruppe",
    );
  },
);

runTestAsAdmin(
  "should not show restore dialog after clicking discard button",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Change anbefalt term to create unsaved changes
    await editPage.fillAnbefaltTermField(newTerm, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click discard
    await editPage.expectRestoreDialog();
    await editPage.clickDiscardButton();

    // Verify the form shows original data (not the changed term)
    await editPage.expectAnbefaltTermField(
      "Bokmål",
      concept.anbefaltTerm.navn.nb as string,
    );

    // Refresh again - should not show restore dialog
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should show restore dialog multiple times until data is discarded",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Change anbefalt term to create unsaved changes
    await editPage.fillAnbefaltTermField(newTerm, [], false);
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
  "should auto-save relation modal data and show restore dialog",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Open relation modal
    await editPage.clickAddRelation();

    // Fill in the relation form
    await editPage.page.getByText("Publisert begrep på data.norge.no").click();
    await editPage.page
      .getByRole("group", { name: "Relatert begrep" })
      .getByRole("combobox")
      .click();
    await editPage.page.waitForTimeout(100);
    await editPage.page
      .getByRole("group", { name: "Relatert begrep" })
      .getByLabel("Søk begrep")
      .fill("test");
    await editPage.page.waitForTimeout(100);
    await editPage.page.getByLabel("Test endringsloggen").first().click();
    await editPage.page.waitForTimeout(100);
    await editPage.page.getByLabel("RelasjonMå fylles ut").click();
    await editPage.page.getByLabel("Se også").click();
    await editPage.waitForAutoSaveToComplete();

    // Don't close the modal, just refresh the page
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the relation data was restored by checking if the relation was added
    await expect(editPage.page.getByText("Test endringsloggen")).toBeVisible();
    await expect(editPage.page.getByText("Se også")).toBeVisible();
  },
);

runTestAsAdmin(
  "should not show restore dialog when concept form has no unsaved changes",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Don't make any changes, just refresh the page
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should clear auto-save data after successful concept form submission",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Change anbefalt term to create unsaved changes
    await editPage.fillAnbefaltTermField(newTerm, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Save the form
    await editPage.clickSaveButton();

    // Verify we're back on the details page
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await expect(page).toHaveURL(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );

    // Navigate back to edit page
    await detailPage.editConcept();

    // Refresh the page - should not show restore dialog since data was saved
    await page.reload();

    // Verify no restore dialog appears
    await editPage.expectNoRestoreDialog();
  },
);

runTestAsAdmin(
  "should auto-save tillatt term data and restore correctly",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTillattTerm = {
      nb: [uniqueString("tillatt_nb")],
      nn: [uniqueString("tillatt_nn")],
      en: [uniqueString("tillatt_en")],
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Fill in tillatt term data
    await editPage.fillLanguageField(
      newTillattTerm,
      "Tillatt term Hjelp til utfylling",
      [],
      false,
    );
    await editPage.waitForAutoSaveToComplete();

    // Refresh the page to trigger auto-save restore dialog
    await page.reload();

    // Wait for restore dialog and click restore
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();

    // Verify the tillatt term data was restored
    await expect(editPage.page.getByText(newTillattTerm.nb[0])).toBeVisible();
    await expect(editPage.page.getByText(newTillattTerm.nn[0])).toBeVisible();
    await expect(editPage.page.getByText(newTillattTerm.en[0])).toBeVisible();
  },
);

runTestAsAdmin(
  "should discard auto-save data when changes are reverted to original state",
  async ({ page, conceptsPage, playwright }) => {
    const concept = await createRandomConcept(playwright);
    const newTerm = {
      nb: uniqueString("new_term_nb"),
      nn: uniqueString("new_term_nn"),
      en: uniqueString("new_term_en"),
    };

    // Navigate to concept details and click edit
    const detailPage: DetailPage = conceptsPage.detailPage;
    await detailPage.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
    );
    await detailPage.editConcept();

    // Initialize edit page
    const editPage: EditPage = conceptsPage.editPage;
    await editPage.expectEditPageUrl(concept.id);

    // Step 1: Make initial changes and auto-save
    await editPage.fillAnbefaltTermField(newTerm, [], false);
    await editPage.waitForAutoSaveToComplete();

    // Step 2: Refresh and verify restore dialog appears
    await page.reload();
    await editPage.expectRestoreDialog();
    await editPage.clickRestoreButton();
    await editPage.expectRestoreSuccessMessage();

    // Step 3: Revert changes back to original state
    await editPage.fillAnbefaltTermField(concept.anbefaltTerm.navn, [], false);
    // Press tab to trigger onBlur to make sure the autosave is triggered
    await editPage.waitForAutoSaveToComplete();

    // Step 4: Refresh again - should NOT show restore dialog since we reverted to original
    await page.reload();

    // Verify no restore dialog appears because changes were reverted to original state
    await editPage.expectNoRestoreDialog();

    // Verify the form shows the original data
    await editPage.expectAnbefaltTermField(
      "Bokmål",
      concept.anbefaltTerm.navn.nb as string,
    );
    await editPage.expectAnbefaltTermField(
      "Nynorsk",
      concept.anbefaltTerm.navn.nn as string,
    );
    await editPage.expectAnbefaltTermField(
      "Engelsk",
      concept.anbefaltTerm.navn.en as string,
    );
  },
);
