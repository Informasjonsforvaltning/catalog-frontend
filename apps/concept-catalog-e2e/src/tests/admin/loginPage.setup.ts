import { runTest } from '../../fixtures/basePage';

runTest('login as admin user', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAsAdmin();
});
