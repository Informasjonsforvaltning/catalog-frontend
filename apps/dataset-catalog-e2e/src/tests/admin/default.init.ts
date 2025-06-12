import { runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, deleteAllDatasets } from '../../utils/helpers';

initAsAdmin('delete all existing datasets', async ({ playwright }) => {
  console.log('[INIT] Creating API request context with admin storage state...');
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  console.log('[INIT] API request context created:', !!apiRequestContext);

  console.log('[INIT] Deleting all existing datasets...');
  await deleteAllDatasets(apiRequestContext);
  console.log('[INIT] All existing datasets deleted.');
});
