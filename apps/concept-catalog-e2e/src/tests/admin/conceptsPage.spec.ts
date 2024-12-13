import { ALL_CONCEPTS, CONCEPT_1, CONCEPT_2, CONCEPT_3 } from '../../data/concepts';
import { runTestAsAdmin } from '../../fixtures/basePage';

runTestAsAdmin('test if the search page renders correctly', async ({ conceptsPage }) => {
  await conceptsPage.goto();
  await conceptsPage.expectFiltersToBeVisible();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});

runTestAsAdmin('test search', async ({ conceptsPage }) => {
  await conceptsPage.goto();
  await conceptsPage.search('test concept 2');
  await conceptsPage.expectSearchResults([CONCEPT_2], [CONCEPT_1, CONCEPT_3]);

  await conceptsPage.clearSearch();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});

runTestAsAdmin('test status filter', async ({ conceptsPage }) => {
  await conceptsPage.goto();
  await conceptsPage.filterStatusCompleted();
  await conceptsPage.expectSearchResults([CONCEPT_1], [CONCEPT_2, CONCEPT_3]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatusDeprecated();
  await conceptsPage.expectSearchResults([CONCEPT_2], [CONCEPT_1, CONCEPT_3]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatusWithDrawn();
  await conceptsPage.expectSearchResults([CONCEPT_3], [CONCEPT_1, CONCEPT_2]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatusUnderDevelopment();
  await conceptsPage.expectSearchResults([]);

  await conceptsPage.clearFilters();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});

runTestAsAdmin('test published state filter', async ({ conceptsPage }) => {
  await conceptsPage.goto();
  await conceptsPage.filterPublished();
  await conceptsPage.expectSearchResults([]);

  await conceptsPage.clearFilters();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
  await conceptsPage.filterNotPublished();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});
