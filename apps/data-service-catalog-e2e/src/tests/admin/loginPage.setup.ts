import { test, expect } from '../../fixtures/basePage';

test('should login as admin', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAsAdmin();

  // Wait for redirect to data services page
  await expect(loginPage.page).toHaveURL(/\/catalogs\/.*\/data-services/);
});
