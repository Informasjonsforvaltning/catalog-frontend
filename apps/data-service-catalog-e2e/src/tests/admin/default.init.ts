import { test } from '../../fixtures/basePage';
import { deleteAllDataServices, adminAuthFile } from '../../utils/helpers';

test('should clean up test data', async ({ playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Clean up all test data services
  await deleteAllDataServices(apiRequestContext);

  console.log('[INIT] Test data cleanup completed');
});
