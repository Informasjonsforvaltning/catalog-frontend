import { ALL_CONCEPTS, CONCEPT_1, CONCEPT_2, CONCEPT_3 } from '../../data/concepts';
import { runTestAsAdmin } from '../../fixtures/basePage';
import ConceptsPage from '../../page-object-model/conceptsPage';

type TestProps = { conceptsPage: ConceptsPage };

runTestAsAdmin('test if the detail page renders correctly', async ({ conceptsPage }: TestProps) => {
  await conceptsPage.goto();  
  await conceptsPage.expectSearchResults(ALL_CONCEPTS);
  await conceptsPage.gotoDetailPage(CONCEPT_1);
  await conceptsPage.detailPage.checkAccessibility();
  await conceptsPage.detailPage.expectDetails(CONCEPT_1);
});
