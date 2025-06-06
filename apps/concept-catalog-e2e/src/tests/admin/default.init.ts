import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, deleteAllConcepts } from '../../utils/helpers';

initAsAdmin('delete all existing concepts', async ({ playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  await deleteAllConcepts(apiRequestContext);
});
