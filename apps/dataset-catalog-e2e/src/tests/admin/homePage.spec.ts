import { runTestAsAdmin } from '../../fixtures/basePage';
import HomePage from '../../page-object-model/homePage';

runTestAsAdmin('the home page should redirect us to registration portal', async ({ homePage }: { homePage: HomePage }) => {
  console.log('[TEST] Navigating to home page...');
  await homePage.goto();
  console.log('[TEST] Checking if redirected to registration portal...');
  await homePage.checkIfRedirectedToRegistrationPortal();
  console.log('[TEST] Finished test: home page should redirect us to registration portal');
});
