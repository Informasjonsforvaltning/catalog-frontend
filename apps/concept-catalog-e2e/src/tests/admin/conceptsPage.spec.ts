import { Concept } from '@catalog-frontend/types';
import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, ConceptStatus } from '../../utils/helpers';

// Helper to generate a unique, random string
function uniqueString(prefix = 'concept') {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
}

runTestAsAdmin('test if the search page renders correctly', async ({ conceptsPage, playwright }) => {
  await conceptsPage.goto();
  await conceptsPage.checkAccessibility();
  await conceptsPage.expectFiltersToBeVisible();
});

runTestAsAdmin('test search with random concepts', async ({ conceptsPage, playwright }) => {
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

  // Create concepts via API
  for (const concept of randomConcepts) {
    await createConcept(apiRequestContext, concept);
  }

  await conceptsPage.goto();

  for (const concept of randomConcepts) {
    await conceptsPage.search(concept.anbefaltTerm.navn.nb);
    await conceptsPage.expectSearchResults([concept], randomConcepts.filter(c => c !== concept));
  }
});

runTestAsAdmin('test status filter with random concepts', async ({ conceptsPage, playwright }) => {
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
      }
    },
    statusURI: ConceptStatus[Object.keys(ConceptStatus)[i % Object.keys(ConceptStatus).length] as keyof typeof ConceptStatus],
  }));

  for (const concept of randomConcepts) {
    await createConcept(apiRequestContext, concept);
  }

  await conceptsPage.goto();

  // Filter by status of the first concept
  await conceptsPage.filterStatus(randomConcepts[0].statusURI);
  await conceptsPage.search(randomConcepts[0].anbefaltTerm.navn.nb);
  await conceptsPage.expectSearchResults([randomConcepts[0]], [randomConcepts[1], randomConcepts[2]]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatus(randomConcepts[1].statusURI);
  await conceptsPage.search(randomConcepts[1].anbefaltTerm.navn.nb);
  await conceptsPage.expectSearchResults([randomConcepts[1]], [randomConcepts[0], randomConcepts[2]]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatus(randomConcepts[2].statusURI);
  await conceptsPage.search(randomConcepts[2].anbefaltTerm.navn.nb);
  await conceptsPage.expectSearchResults([randomConcepts[2]], [randomConcepts[0], randomConcepts[1]]);

  await conceptsPage.clearFilters();
  for (const concept of randomConcepts) {
    await conceptsPage.search(concept.anbefaltTerm.navn.nb);
    await conceptsPage.expectSearchResults([concept], randomConcepts.filter(c => c !== concept));
  }
});