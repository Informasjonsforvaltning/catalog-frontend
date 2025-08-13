import { runTestAsAdmin } from '../../fixtures/basePage';

runTestAsAdmin('the home page should redirect us to registration portal', async ({ homePage }) => {
  console.log('[TEST] Navigating to home page...');
  await homePage.goto();
  console.log('[TEST] Checking if redirected to registration portal...');
  await homePage.checkIfRedirectedToRegistrationPortal();  
  console.log('[TEST] Finished test: home page should redirect us to registration portal');
});
