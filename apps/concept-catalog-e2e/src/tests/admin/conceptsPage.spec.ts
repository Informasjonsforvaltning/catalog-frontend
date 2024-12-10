import { ALL_SERVICES, SERVICE_1, SERVICE_2, SERVICE_3 } from '../../data/services';
import { runTestAsAdmin } from '../../fixtures/basePage';

runTestAsAdmin('test if the search page renders correctly', async ({ servicesPage }) => {
  await servicesPage.goto();
  await servicesPage.expectFiltersToBeVisible();
  await servicesPage.expectSearchResults(ALL_SERVICES);
});

runTestAsAdmin('test search', async ({ servicesPage }) => {
  await servicesPage.goto();
  await servicesPage.search('test service 2');
  await servicesPage.expectSearchResults([SERVICE_2], [SERVICE_1, SERVICE_3]);

  await servicesPage.clearSearch();
  await servicesPage.expectSearchResults(ALL_SERVICES);
});

runTestAsAdmin('test status filter', async ({ servicesPage }) => {
  await servicesPage.goto();
  await servicesPage.filterStatusCompleted();
  await servicesPage.expectSearchResults([SERVICE_1], [SERVICE_2, SERVICE_3]);

  await servicesPage.clearFilters();
  await servicesPage.filterStatusDeprecated();
  await servicesPage.expectSearchResults([SERVICE_2], [SERVICE_1, SERVICE_3]);

  await servicesPage.clearFilters();
  await servicesPage.filterStatusWithDrawn();
  await servicesPage.expectSearchResults([SERVICE_3], [SERVICE_1, SERVICE_2]);

  await servicesPage.clearFilters();
  await servicesPage.filterStatusUnderDevelopment();
  await servicesPage.expectSearchResults([]);

  await servicesPage.clearFilters();
  await servicesPage.expectSearchResults(ALL_SERVICES);
});

runTestAsAdmin('test published state filter', async ({ servicesPage }) => {
  await servicesPage.goto();
  await servicesPage.filterPublished();
  await servicesPage.expectSearchResults([]);

  await servicesPage.clearFilters();
  await servicesPage.expectSearchResults(ALL_SERVICES);
  await servicesPage.filterNotPublished();
  await servicesPage.expectSearchResults(ALL_SERVICES);
});
