import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';
import ConceptsPage from '../../page-object-model/conceptsPage';

type TestProps = { conceptsPage: ConceptsPage };

initAsAdmin('delete all existing concepts and create new', async ({ conceptsPage }: TestProps) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to concepts page', () => conceptsPage.goto());
  await init.step('Delete all concepts', () => conceptsPage.deleteAllConcepts());
  await init.step('Create concepts', () => conceptsPage.createConcepts());
});
