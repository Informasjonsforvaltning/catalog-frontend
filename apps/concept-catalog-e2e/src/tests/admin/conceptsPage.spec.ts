import { runTestAsAdmin, runSerialTestsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createConcept,
  ConceptStatus,
  uniqueString,
} from "../../utils/helpers";
import { expect } from "@playwright/test";
import { localization } from "@catalog-frontend/utils";

runTestAsAdmin(
  "test if the search page renders correctly",
  async ({ conceptsPage, playwright }) => {
    console.log("[TEST] Navigating to concepts page...");
    await conceptsPage.goto();
    console.log("[TEST] Checking accessibility...");
    await conceptsPage.checkAccessibility();
    console.log("[TEST] Expecting filters to be visible...");
    await conceptsPage.expectFiltersToBeVisible();
    console.log("[TEST] Finished test: search page renders correctly");
  },
);

runTestAsAdmin(
  "test search with random concepts",
  async ({ conceptsPage, playwright }) => {
    console.log("[TEST] Creating API request context...");
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // Create three fully unique random concepts
    const randomConcepts = Array.from({ length: 3 }).map((_, i) => ({
      anbefaltTerm: {
        navn: {
          nb: uniqueString("nb"),
          nn: uniqueString("nn"),
          en: uniqueString("en"),
        },
      },
      definisjon: {
        tekst: {
          nb: uniqueString("def_nb"),
          nn: uniqueString("def_nn"),
          en: uniqueString("def_en"),
        },
      },
      statusURI:
        ConceptStatus[
          Object.keys(ConceptStatus)[
            i % Object.keys(ConceptStatus).length
          ] as keyof typeof ConceptStatus
        ],
    }));

    console.log("[TEST] Creating random concepts via API...");
    for (const concept of randomConcepts) {
      console.log(`[TEST] Creating concept: ${concept.anbefaltTerm.navn.nb}`);
      await createConcept(apiRequestContext, concept);
    }

    console.log("[TEST] Navigating to concepts page...");
    await conceptsPage.goto();

    for (const concept of randomConcepts) {
      console.log(
        `[TEST] Searching for concept: ${concept.anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.search(concept.anbefaltTerm.navn.nb);
      console.log(
        `[TEST] Expecting only this concept in results: ${concept.anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.expectSearchResults(
        [concept],
        randomConcepts.filter((c) => c !== concept),
      );
    }
    console.log("[TEST] Finished test: search with random concepts");
  },
);

runTestAsAdmin(
  "test status filter with random concepts",
  async ({ conceptsPage, playwright }) => {
    console.log("[TEST] Creating API request context...");
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // Create three random concepts with unique statuses
    const randomConcepts = Array.from({ length: 3 }).map((_, i) => ({
      anbefaltTerm: {
        navn: {
          nb: uniqueString("nb"),
          nn: uniqueString("nn"),
          en: uniqueString("en"),
        },
      },
      definisjon: {
        tekst: {
          nb: uniqueString("def_nb"),
          nn: uniqueString("def_nn"),
          en: uniqueString("def_en"),
        },
      },
      statusURI:
        ConceptStatus[
          Object.keys(ConceptStatus)[
            i % Object.keys(ConceptStatus).length
          ] as keyof typeof ConceptStatus
        ],
    }));

    console.log("[TEST] Creating random concepts via API...");
    for (const concept of randomConcepts) {
      console.log(
        `[TEST] Creating concept: ${concept.anbefaltTerm.navn.nb} with status ${concept.statusURI}`,
      );
      await createConcept(apiRequestContext, concept);
    }

    console.log("[TEST] Navigating to concepts page...");
    await conceptsPage.goto();

    // Filter by status of the first concept
    for (let i = 0; i < randomConcepts.length; i++) {
      console.log(
        `[TEST] Clearing filters and filtering by status: ${randomConcepts[i].statusURI}`,
      );
      await conceptsPage.clearFilters();
      await conceptsPage.filterStatus(randomConcepts[i].statusURI);
      console.log(
        `[TEST] Searching for concept: ${randomConcepts[i].anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.search(randomConcepts[i].anbefaltTerm.navn.nb);
      const otherConcepts = randomConcepts.filter((_, idx) => idx !== i);
      console.log(
        `[TEST] Expecting only this concept in results: ${randomConcepts[i].anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.expectSearchResults(
        [randomConcepts[i]],
        otherConcepts,
      );
    }

    console.log("[TEST] Clearing filters and searching for each concept...");
    await conceptsPage.clearFilters();
    for (const concept of randomConcepts) {
      console.log(
        `[TEST] Searching for concept: ${concept.anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.search(concept.anbefaltTerm.navn.nb);
      console.log(
        `[TEST] Expecting only this concept in results: ${concept.anbefaltTerm.navn.nb}`,
      );
      await conceptsPage.expectSearchResults(
        [concept],
        randomConcepts.filter((c) => c !== concept),
      );
    }
    console.log("[TEST] Finished test: status filter with random concepts");
  },
);

runTestAsAdmin(
  "Test if a modal opens when click Import",
  async ({ conceptsPage, playwright }) => {
    console.log("[TEST] Creating API request context for Admin user...");
    await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    await conceptsPage.goto();

    // Click the Import button
    console.log("[TEST] Clicking Importer Button...");
    await conceptsPage.page.getByRole("button", { name: "Importer" }).click();

    // A modal should open
    console.log("[TEST] Expecting an open modal...");
    await expect(conceptsPage.page.getByRole("dialog")).toBeVisible({
      timeout: 5000,
    });

    const dialog = conceptsPage.page.getByRole("dialog", {
      has: conceptsPage.page
        .getByRole("button")
        .filter({
          hasText: `${localization.importResult.results}`,
          exact: true,
        }),
    });

    console.log("[TEST] Checking that there are 3 buttons in the modal...");

    await expect(
      dialog
        .getByRole("button")
        .filter({ hasText: `${localization.button.importConceptRDF}` }),
    ).toBeVisible({ timeout: 20000 });

    await expect(
      dialog
        .getByRole("button")
        .filter({ hasText: `${localization.button.importConceptCSV}` }),
    ).toBeVisible({ timeout: 20000 });

    await expect(
      dialog
        .getByRole("button")
        .filter({ hasText: `${localization.importResult.results}` }),
    ).toBeVisible({
      timeout: 20000,
    });
  },
);

runSerialTestsAdmin("Test @solo importing RDF", [
  {
    name: "Test cancelling import turtle file after uploading and sending",
    fn: async ({ conceptsPage, playwright }) => {
      const apiRequestContext = await playwright.request.newContext({
        storageState: adminAuthFile,
      });

      const importResultDetailsPage = conceptsPage.importResultDetailsPage;

      console.log("[TEST] Deleting all previous import results...");
      await importResultDetailsPage.deleteAllImportResults(apiRequestContext);

      console.log("[TEST] Importing turtle file...");
      const importId: string =
        await conceptsPage.importTurtleFile("begreper.ttl");

      expect(importId != null);

      console.log("[TEST] Redirecting to the created import result...");
      await importResultDetailsPage.goto(importId, { timeout: 20000 });

      console.log("[TEST] Checking buttons...");
      await importResultDetailsPage.checkWaitingForConfirmationStatus();

      console.log("[TEST] Cancelling import...");
      await importResultDetailsPage.cancelImport();

      console.log("[TEST] Checking cancelled status...");
      await importResultDetailsPage.checkCancelledStatus();
    },
  },
  {
    name: "Test if a modal can import Turtle file and confirm saving concepts ",
    fn: async ({ conceptsPage, playwright }) => {
      const apiRequestContext = await playwright.request.newContext({
        storageState: adminAuthFile,
      });

      const importResultDetailsPage = conceptsPage.importResultDetailsPage;

      console.log("[TEST] Importing turtle file...");
      const importId: string =
        await conceptsPage.importTurtleFile("begreper.ttl");

      console.log("[TEST] checking import ID...");
      expect(importId != null);

      console.log("[TEST] Going to import-result page...");
      await importResultDetailsPage.goto(importId, { timeout: 5000 });

      console.log("[TEST] Checking buttons in import-result page...");
      await importResultDetailsPage.checkVisibleButtons();

      console.log("[TEST] Checking Til gjennomgang status...");
      await importResultDetailsPage.checkWaitingForConfirmationStatus();

      console.log("[TEST] Checking that delete button is disabled...");
      await importResultDetailsPage.checkDisabledDeleteButton();

      console.log("[TEST] Confirming import...");
      await importResultDetailsPage.confirmImport();

      console.log("[TEST] Checking successful status...");
      await importResultDetailsPage.checkSuccessfulStatus();
    },
  },
  {
    name: "Test failing of import Turtle file after previously importing and confirm saving concepts",
    fn: async ({ conceptsPage, playwright }) => {
      const apiRequestContext = await playwright.request.newContext({
        storageState: adminAuthFile,
      });

      const importResultDetailsPage = conceptsPage.importResultDetailsPage;

      console.log("[TEST] Importing turtle file...");
      const importIdFailure: string =
        await conceptsPage.importTurtleFile("begreper.ttl");

      console.log("[TEST] Going to import-result page...");
      await importResultDetailsPage.goto(importIdFailure, { timeout: 5000 });

      console.log("[TEST] Checking failure status...");
      await importResultDetailsPage.checkFailedStatus();
    },
  },
]);
