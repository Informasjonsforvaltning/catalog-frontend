import { ALL_CONCEPTS, CONCEPT_2, CONCEPT_2_UPDATED } from '../../data/concepts';
import { runTestAsAdmin } from '../../fixtures/basePage';
import ConceptsPage from '../../page-object-model/conceptsPage';

type TestProps = { conceptsPage: ConceptsPage };

runTestAsAdmin('test if updating an existing concept saves correctly', async ({ conceptsPage }: TestProps) => {
  await conceptsPage.goto();
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
  await conceptsPage.gotoDetailPage(CONCEPT_2);
  await conceptsPage.detailPage.editConcept();
  await conceptsPage.editPage.checkAccessibility();
  await conceptsPage.editPage.fillFormAndSave(CONCEPT_2_UPDATED, true);
  await conceptsPage.detailPage.expectDetails(CONCEPT_2_UPDATED);
});
