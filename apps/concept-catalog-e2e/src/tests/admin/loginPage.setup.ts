import { runTest } from '../../fixtures/basePage';

runTest('login as admin user', async ({ loginPage }) => {
  console.log('[SETUP] Navigating to login page...');
  await loginPage.goto();
  console.log('[SETUP] Logging in as admin user...');
  await loginPage.loginAsAdmin();
  console.log('[SETUP] Finished test: login as admin user');
});
