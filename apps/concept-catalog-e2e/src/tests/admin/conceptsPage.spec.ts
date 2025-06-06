import { Concept } from '@catalog-frontend/types';
import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, ConceptStatus, uniqueString } from '../../utils/helpers';

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
  for (let i = 0; i < randomConcepts.length; i++) {
    await conceptsPage.clearFilters();
    await conceptsPage.filterStatus(randomConcepts[i].statusURI);
    await conceptsPage.search(randomConcepts[i].anbefaltTerm.navn.nb);
    const otherConcepts = randomConcepts.filter((_, idx) => idx !== i);
    await conceptsPage.expectSearchResults([randomConcepts[i]], otherConcepts);
  }

  await conceptsPage.clearFilters();
  for (const concept of randomConcepts) {
    await conceptsPage.search(concept.anbefaltTerm.navn.nb);
    await conceptsPage.expectSearchResults([concept], randomConcepts.filter(c => c !== concept));
  }
});