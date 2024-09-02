import { test as init, runTestAsAdmin as initAsAdmin } from '../../fixtures/basePage';

initAsAdmin('delete all existing services and create new', async ({ servicesPage }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to services page', () => servicesPage.goto());
  await init.step('Delete all services', () => servicesPage.deleteAllServices());
  await init.step('Create services', () => servicesPage.createServices());
});

initAsAdmin('delete all existing public services and create new', async ({ publicServicesPage }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to public services page', () => publicServicesPage.goto());
  await init.step('Delete all public services', () => publicServicesPage.deleteAllPublicServices());
  await init.step('Create public services', () => publicServicesPage.createPublicServices());
});
