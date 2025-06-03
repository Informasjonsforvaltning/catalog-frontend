import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile } from '../../utils/helpers';

initAsAdmin('delete all existing concepts and create new', async ({ playwright }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Now your API call will include the encrypted next-auth cookie
  const response = await apiRequestContext.get('https://staginghttps://concept-catalog.staging.fellesdatakatalog.digdir.no');
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  //await init.step('Navigate to concepts page', () => conceptsPage.goto());
  //await init.step('Delete all concepts', () => conceptsPage.deleteAllConcepts());
  //await init.step('Create concepts', () => conceptsPage.createConcepts());
});
