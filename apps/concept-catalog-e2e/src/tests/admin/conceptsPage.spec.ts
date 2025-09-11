import { Concept, ImportResult } from '@catalog-frontend/types';
import { runTestAsAdmin, skipTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, ConceptStatus, uniqueString, getImportResults } from '../../utils/helpers';
import { expect } from '@playwright/test';
import * as path from 'node:path';

runTestAsAdmin('test if the search page renders correctly', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Navigating to concepts page...');
  await conceptsPage.goto();
  console.log('[TEST] Checking accessibility...');
  await conceptsPage.checkAccessibility();
  console.log('[TEST] Expecting filters to be visible...');
  await conceptsPage.expectFiltersToBeVisible();
  console.log('[TEST] Finished test: search page renders correctly');
});

runTestAsAdmin('test search with random concepts', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Creating API request context...');
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create three fully unique random concepts
  const randomConcepts = Array.from({ length: 3 }).map((_, i) => ({
    anbefaltTerm: {
      navn: {
        nb: uniqueString('nb'),
        nn: uniqueString('nn'),
        en: uniqueString('en'),
      },
    },
    definisjon: {
      tekst: {
        nb: uniqueString('def_nb'),
        nn: uniqueString('def_nn'),
        en: uniqueString('def_en'),
      }
    },
    statusURI: ConceptStatus[Object.keys(ConceptStatus)[i % Object.keys(ConceptStatus).length] as keyof typeof ConceptStatus],
  }));

  console.log('[TEST] Creating random concepts via API...');
  for (const concept of randomConcepts) {
    console.log(`[TEST] Creating concept: ${concept.anbefaltTerm.navn.nb}`);
    await createConcept(apiRequestContext, concept);
  }

  console.log('[TEST] Navigating to concepts page...');
  await conceptsPage.goto();

  for (const concept of randomConcepts) {
    console.log(`[TEST] Searching for concept: ${concept.anbefaltTerm.navn.nb}`);
    await conceptsPage.search(concept.anbefaltTerm.navn.nb);
    console.log(`[TEST] Expecting only this concept in results: ${concept.anbefaltTerm.navn.nb}`);
    await conceptsPage.expectSearchResults([concept], randomConcepts.filter(c => c !== concept));
  }
  console.log('[TEST] Finished test: search with random concepts');
});

runTestAsAdmin('test status filter with random concepts', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Creating API request context...');
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create three random concepts with unique statuses
  const randomConcepts = Array.from({ length: 3 }).map((_, i) => ({
    anbefaltTerm: {
      navn: {
        nb: uniqueString('nb'),
        nn: uniqueString('nn'),
        en: uniqueString('en'),
      },
    },
    definisjon: {
      tekst: {
        nb: uniqueString('def_nb'),
        nn: uniqueString('def_nn'),
        en: uniqueString('def_en'),
      },
    },
    statusURI:
      ConceptStatus[Object.keys(ConceptStatus)[i % Object.keys(ConceptStatus).length] as keyof typeof ConceptStatus],
  }));

  console.log('[TEST] Creating random concepts via API...');
  for (const concept of randomConcepts) {
    console.log(`[TEST] Creating concept: ${concept.anbefaltTerm.navn.nb} with status ${concept.statusURI}`);
    await createConcept(apiRequestContext, concept);
  }

  console.log('[TEST] Navigating to concepts page...');
  await conceptsPage.goto();

  // Filter by status of the first concept
  for (let i = 0; i < randomConcepts.length; i++) {
    console.log(`[TEST] Clearing filters and filtering by status: ${randomConcepts[i].statusURI}`);
    await conceptsPage.clearFilters();
    await conceptsPage.filterStatus(randomConcepts[i].statusURI);
    console.log(`[TEST] Searching for concept: ${randomConcepts[i].anbefaltTerm.navn.nb}`);
    await conceptsPage.search(randomConcepts[i].anbefaltTerm.navn.nb);
    const otherConcepts = randomConcepts.filter((_, idx) => idx !== i);
    console.log(`[TEST] Expecting only this concept in results: ${randomConcepts[i].anbefaltTerm.navn.nb}`);
    await conceptsPage.expectSearchResults([randomConcepts[i]], otherConcepts);
  }

  console.log('[TEST] Clearing filters and searching for each concept...');
  await conceptsPage.clearFilters();
  for (const concept of randomConcepts) {
    console.log(`[TEST] Searching for concept: ${concept.anbefaltTerm.navn.nb}`);
    await conceptsPage.search(concept.anbefaltTerm.navn.nb);
    console.log(`[TEST] Expecting only this concept in results: ${concept.anbefaltTerm.navn.nb}`);
    await conceptsPage.expectSearchResults(
      [concept],
      randomConcepts.filter((c) => c !== concept),
    );
  }
  console.log('[TEST] Finished test: status filter with random concepts');
});

runTestAsAdmin('Test if a modal opens when click Import', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Creating API request context for Admin user...');
  await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  await conceptsPage.goto();

  // Click the Import button
  console.log('[TEST] Clicking Importer Button...');
  await conceptsPage.page.getByRole('button', { name: 'Importer' }).click();

  // A modal should open
  console.log('[TEST] Expecting an open modal...');
  await expect(conceptsPage.page.getByRole('dialog')).toBeVisible({ timeout: 5000 });

  const dialog = conceptsPage.page.getByRole('dialog', {
    has: conceptsPage.page.getByRole('button', { name: 'Resultater' }),
  });

  console.log('[TEST] Checking that there are 3 buttons in the modal...');
  await expect(dialog.getByRole('link', { name: 'Resultater' }))
    .toBeVisible({ timeout: 5000 });

  await expect(dialog.getByRole('button', { name: 'Importer RDF' }))
    .toBeVisible({ timeout: 5000 });

  await expect(dialog.getByRole('button', { name: 'Importer CSV/JSON' }))
    .toBeVisible({ timeout: 5000 });

});

skipTestAsAdmin('Skipped Test if a modal can import Turtle file', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Creating API request context for Admin user...');
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const filePath = path.resolve(__dirname, '../../data/begreper.ttl');

  console.log("File path: ", filePath);

  await conceptsPage.goto();

  // Click the Import button
  console.log('[TEST] Clicking Importer Button...');
  await conceptsPage.page.getByRole('button', { name: 'Importer' }).click();

  // A modal should open
  console.log('[TEST] Expecting an open modal...');
  await expect(conceptsPage.page.getByRole('dialog')).toBeVisible({ timeout: 5000 });

  let dialog = conceptsPage.page.getByRole('dialog', {
    has: conceptsPage.page.getByRole('button', { name: 'Importer RDF' }),
  });

  const importerRdfButton = dialog.getByRole('button', { name: 'Importer RDF' });

  await importerRdfButton.click({ timeout: 5000 });

  console.log('[TEST] Clicking Importer RDF Button...');
  const fileInput = await conceptsPage.page
    .locator('input[type="file"][accept*=".ttl"], input[type="file"][accept*="ttl"]')
    .first();
  await expect(fileInput).toBeAttached({ timeout: 5000 });

  await fileInput.setInputFiles(filePath);

  dialog = conceptsPage.page.getByRole('dialog', {
    has: conceptsPage.page.getByRole('button', { name: 'Send' }),
  });

  await expect(dialog.getByRole('button', { name: 'Importer RDF' })).toBeHidden({ timeout: 5000 });
  await expect(dialog.getByRole('button', { name: 'Send' })).toBeVisible({ timeout: 5000 });

  const sendButton = dialog.getByRole('button', { name: 'Send' });
  expect(sendButton).not.toBeDisabled({ timeout: 5000 });

  await Promise.all([
      conceptsPage.page.waitForURL('**/import-results/**', { timeout: 60_000 }),
      sendButton.click({ timeout: 10000 }),
  ]);

  await expect(conceptsPage.page).toHaveURL(/\/import-results\/.+/i);

  const url = conceptsPage.page.url();
  console.log("Import result URL: ", url);

  const importId = url.split('/').pop();
  console.log("Import result ID: ", url);

  expect(importId != null);

  await conceptsPage.importResultsPage.deleteAllImportResults(apiRequestContext);

});

runTestAsAdmin('Test if a modal can import Turtle file and confirm saving concepts', async ({ conceptsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const importId: string = await conceptsPage.importTurtleFile("begreper.ttl");

  expect(importId != null);

  const importResultDetailsPage = conceptsPage.importResultDetailsPage;

  await importResultDetailsPage.goto(importId, { timeout: 5000 });

  await importResultDetailsPage.checkVisibleButtons();

  await importResultDetailsPage.checkWaitingForConfirmationStatus()

  await importResultDetailsPage.checkDisabledDeleteButton();

  await importResultDetailsPage.confirmImport();

  await importResultDetailsPage.checkSuccessfulStatus();

  await importResultDetailsPage.deleteAllImportResults(apiRequestContext);

})

runTestAsAdmin('Test if cancelling import Turtle file', async ({ conceptsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const importId: string = await conceptsPage.importTurtleFile("begreper.ttl");

  expect(importId != null);

  const importResultDetailsPage = conceptsPage.importResultDetailsPage;

  await importResultDetailsPage.goto(importId, { timeout: 5000 });

  await importResultDetailsPage.checkWaitingForConfirmationStatus();

  await importResultDetailsPage.cancelImport();

  await importResultDetailsPage.checkCancelledStatus();

  await importResultDetailsPage.deleteAllImportResults(apiRequestContext);

})

runTestAsAdmin('Test failing of import Turtle file after previously importing and confirm saving concepts',
  async ({ conceptsPage, playwright }) => {

  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const importIdSuccess: string = await conceptsPage.importTurtleFile("begreper.ttl");

  expect(importIdSuccess != null);

  const importResultDetailsPage = conceptsPage.importResultDetailsPage;

  await importResultDetailsPage.goto(importIdSuccess, { timeout: 5000 });

  await importResultDetailsPage.checkWaitingForConfirmationStatus();

  await importResultDetailsPage.confirmImport();

  await importResultDetailsPage.checkSuccessfulStatus();

  await conceptsPage.goto()

  const importIdFailure: string = await conceptsPage.importTurtleFile("begreper.ttl");

  await importResultDetailsPage.goto(importIdFailure, { timeout: 5000 });

  await importResultDetailsPage.checkFailedStatus();

  //await importResultDetailsPage.deleteAllImportResults(apiRequestContext);

})

skipTestAsAdmin('Test get all results', async ({ conceptsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const importResults: ImportResult[] = await getImportResults(apiRequestContext);
  console.log("Import results: ", importResults)

  importResults.forEach(ir => {
    console.log("ImportResult ID: ", ir?.id);
  });

});