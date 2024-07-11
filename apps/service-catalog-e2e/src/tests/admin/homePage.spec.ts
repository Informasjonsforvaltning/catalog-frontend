import { test } from '../../fixtures/basePage';
import { adminAuthFile } from '../../utils/helpers';

test.use({ storageState: adminAuthFile });

test('the home page should redirect us to registration portal', async ({ loginPage, homePage }) => {
  await homePage.goto();
  await homePage.checkIfRedirectedToRegistrationPortal();
});
