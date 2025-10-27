import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, ConceptStatus, uniqueString } from '../../utils/helpers';

runTestAsAdmin('test if the search page renders correctly', async ({ conceptsPage }) => {
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
      },
    },
    statusURI:
      ConceptStatus[Object.keys(ConceptStatus)[i % Object.keys(ConceptStatus).length] as keyof typeof ConceptStatus],
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
    await conceptsPage.expectSearchResults(
      [concept],
      randomConcepts.filter((c) => c !== concept),
    );
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
