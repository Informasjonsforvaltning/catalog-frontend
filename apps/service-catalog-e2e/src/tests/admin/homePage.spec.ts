import { runTestAsAdmin } from '../../fixtures/basePage';

runTestAsAdmin('the home page should redirect us to registration portal', async ({ homePage }) => {
  await homePage.goto();
  await homePage.checkIfRedirectedToRegistrationPortal();
});
