import { runTestAsAdmin } from '../../fixtures/basePage';

runTestAsAdmin('the home page should display all catalogs', async ({ homePage }) => {
  await homePage.goto();
});
