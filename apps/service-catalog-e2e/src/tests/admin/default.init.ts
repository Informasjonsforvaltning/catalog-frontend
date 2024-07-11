import { test as init } from '../../fixtures/basePage';
import { adminAuthFile } from '../../utils/helpers';

init.use({ storageState: adminAuthFile });

init('delete all existing services and create new', async ({ loginPage, servicesPage }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to services page', () => servicesPage.goto());
  await init.step('Delete all services', () => servicesPage.deleteAllServices());
  await init.step('Create services', () => servicesPage.createServices());
});

init('delete all existing public services and create new', async ({ loginPage, publicServicesPage }) => {
  // set timeout to 120 seconds
  init.setTimeout(120 * 1000);

  await init.step('Navigate to public services page', () => publicServicesPage.goto());
  await init.step('Delete all public services', () => publicServicesPage.deleteAllPublicServices());
  await init.step('Create public services', () => publicServicesPage.createPublicServices());
});
