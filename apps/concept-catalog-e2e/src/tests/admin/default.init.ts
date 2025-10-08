import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, deleteAllConcepts, deleteAllImportResults } from '../../utils/helpers';

initAsAdmin('delete all existing concepts', async ({ playwright, conceptsPage }) => {
  console.log('[INIT] Creating API request context with admin storage state...');
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  console.log('[INIT] API request context created:', !!apiRequestContext);

  console.log('[INIT] Deleting all existing concepts...');
  await deleteAllConcepts(apiRequestContext);
  console.log('[INIT] All existing concepts deleted.');
});

initAsAdmin('Hide devtools', async ({ conceptsPage }) => {
  console.log('[INIT] Hiding devtools...');
  await conceptsPage.goto();
  await conceptsPage.hideDevtools();
  console.log('[INIT] Devtools hidden.');
});

initAsAdmin('delete all existing import results', async ({ playwright, conceptsPage }) => {

  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  await deleteAllImportResults(apiRequestContext)
});