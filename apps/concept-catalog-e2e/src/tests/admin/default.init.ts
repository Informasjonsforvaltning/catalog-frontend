import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';

initAsAdmin('delete all existing concepts and create new', async ({ conceptsPage }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to concepts page', () => conceptsPage.goto());
  await init.step('Delete all concepts', () => conceptsPage.deleteAllConcepts());
  await init.step('Create concepts', () => conceptsPage.createConcepts());
});
