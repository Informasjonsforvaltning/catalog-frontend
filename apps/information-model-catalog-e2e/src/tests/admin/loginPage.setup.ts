import { test, expect } from "../../fixtures/basePage";

test("should login as admin", async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAsAdmin();

  await expect(loginPage.page).toHaveURL(/\/catalogs\/.*\/information-models/);
});
