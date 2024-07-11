import { test } from '../../fixtures/basePage';

test('login as admin user', async ({ loginPage }) => {
  await loginPage.loginAsAdmin();
});
