import { ALL_CONCEPTS, CONCEPT_1, CONCEPT_2, CONCEPT_3 } from '../../data/concepts';
import { runTestAsAdmin } from '../../fixtures/basePage';
import ConceptsPage from '../../page-object-model/conceptsPage';

type TestProps = { conceptsPage: ConceptsPage };

runTestAsAdmin('test if the search page renders correctly', async ({ conceptsPage }: TestProps) => {
  await conceptsPage.goto();
  //TODO await conceptsPage.checkAccessibility();
  await conceptsPage.expectFiltersToBeVisible();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});

runTestAsAdmin('test search', async ({ conceptsPage }: TestProps) => {
  await conceptsPage.goto();
  await conceptsPage.search('test concept 2');
  await conceptsPage.expectSearchResults([CONCEPT_2], [CONCEPT_1, CONCEPT_3]);

  await conceptsPage.clearSearch();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});

runTestAsAdmin('test status filter', async ({ conceptsPage }: TestProps) => {
  await conceptsPage.goto();
  await conceptsPage.filterStatusDraft();
  await conceptsPage.expectSearchResults([CONCEPT_1], [CONCEPT_2, CONCEPT_3]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatusCurrent();
  await conceptsPage.expectSearchResults([CONCEPT_2], [CONCEPT_1, CONCEPT_3]);

  await conceptsPage.clearFilters();
  await conceptsPage.filterStatusRejected();
  await conceptsPage.expectSearchResults([CONCEPT_3], [CONCEPT_1, CONCEPT_2]);

  await conceptsPage.clearFilters();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
});
