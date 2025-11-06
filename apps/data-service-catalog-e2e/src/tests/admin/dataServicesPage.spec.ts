import { DataServiceToBeCreated } from "@catalog-frontend/types";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createDataService,
  uniqueString,
  dateStringToDate,
  formatDate,
} from "../../utils/helpers";

const getRandomDataServiceForTest = () => {
  // Create a random data service
  const dataService: DataServiceToBeCreated = {
    title: {
      nb: uniqueString("test_dataservice_nb"),
      nn: uniqueString("test_dataservice_nn"),
      en: uniqueString("test_dataservice_en"),
    },
    description: {
      nb: uniqueString("test_dataservice_description_nb"),
      nn: uniqueString("test_dataservice_description_nn"),
      en: uniqueString("test_dataservice_description_en"),
    },
    endpointUrl: "https://api.example.com/data",
    keywords: {
      nb: ["test", "data", "service"],
      nn: ["test", "data", "tjeneste"],
      en: ["test", "data", "service"],
    },
    contactPoint: {
      name: {
        nb: "Test Contact",
        nn: "Test Kontakt",
        en: "Test Contact",
      },
      email: "test@example.com",
      phone: "+4712345678",
      url: "https://example.com/contact",
    },
  };
  return dataService;
};

runTestAsAdmin(
  "should load data services page",
  async ({ dataServicesPage, playwright }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataService = getRandomDataServiceForTest();
    await createDataService(apiRequestContext, dataService);

    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    // Clear any existing filters before searching
    await dataServicesPage.clearFilters();
    console.log("[Test] Searching for all data services...");
    await dataServicesPage.search("");
    await dataServicesPage.expectHasDataServices();
  },
);

runTestAsAdmin(
  "should show create data service button",
  async ({ dataServicesPage }) => {
    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    await dataServicesPage.expectCreateDataServiceButtonVisible();
  },
);

runTestAsAdmin("should have search input", async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectSearchInputVisible();
});

runTestAsAdmin("should show all filters", async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectAllFiltersVisible();
});

runTestAsAdmin("should show status filter", async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectStatusFilterVisible();
});

runTestAsAdmin("should show published filter", async ({ dataServicesPage }) => {
  await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
  await dataServicesPage.expectPublishedFilterVisible();
});

runTestAsAdmin(
  "should be able to search data services",
  async ({ dataServicesPage, playwright }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataServices = Array.from({ length: 3 }).map((_) =>
      getRandomDataServiceForTest(),
    );
    for (const dataService of dataServices) {
      await createDataService(apiRequestContext, dataService);
    }

    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    await dataServicesPage.expectSearchInputVisible();

    // Clear any existing filters before searching
    await dataServicesPage.clearFilters();

    // Search for the data service
    await dataServicesPage.search(dataServices[0].title.nb as string);

    // Wait for search results to load
    const cardCount = await dataServicesPage.waitForDataServicesToLoad();
    expect(cardCount).toBeGreaterThan(0);

    // Verify the data service exists in search results
    await dataServicesPage.verifyDataServiceExists(
      dataServices[0].title.nb as string,
    );

    // Verify data service details
    await dataServicesPage.verifyDataServiceText(
      dataServices[0].title.nb as string,
      dataServices[0].description.nb as string,
    );
    await dataServicesPage.verifyDataServiceText(
      dataServices[0].title.nb as string,
      "Ikke publisert",
    );
    await dataServicesPage.verifyDataServiceText(
      dataServices[0].title.nb as string,
      `Sist endret ${formatDate(dateStringToDate(new Date().toISOString()))}`,
    );
  },
);

runTestAsAdmin(
  "should show no results when searching for non-existent data service",
  async ({ dataServicesPage, playwright }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const dataService = getRandomDataServiceForTest();
    await createDataService(apiRequestContext, dataService);

    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    await dataServicesPage.expectSearchInputVisible();

    // Clear any existing filters before searching
    await dataServicesPage.clearFilters();

    await dataServicesPage.search("non-existent-dataservice-123");

    // Wait for search results and check for no results message
    await dataServicesPage.waitForDataServicesToLoad();
    await expect(dataServicesPage.noResultsLocator()).toBeVisible();
  },
);

runTestAsAdmin(
  "should display multiple data services",
  async ({ dataServicesPage, playwright }) => {
    // Create a request context with the admin storage state (includes next-auth cookie)
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // Create multiple data services
    const dataServices = Array.from({ length: 3 }).map((_) =>
      getRandomDataServiceForTest(),
    );
    console.log(`[Test] Creating ${dataServices.length} data services...`);

    for (const dataService of dataServices) {
      console.log(
        `[Test] Creating data service with title: ${dataService.title.nb}`,
      );
      await createDataService(apiRequestContext, dataService);
    }

    console.log("[Test] Navigating to data services page...");
    await dataServicesPage.goto(process.env.E2E_CATALOG_ID);
    await dataServicesPage.expectSearchInputVisible();

    // Wait for page to load completely
    await dataServicesPage.page.waitForTimeout(2000);

    // Clear any existing filters before searching
    await dataServicesPage.clearFilters();

    // Search all data services
    console.log("[Test] Searching for all data services...");
    await dataServicesPage.search("");

    // Wait for data services to load
    const cardCount = await dataServicesPage.waitForDataServicesToLoad();
    console.log(`[Test] Found ${cardCount} data service cards`);

    // If no cards found, let's check what's on the page
    if (cardCount === 0) {
      console.log("[Test] No cards found, checking page content...");
      const pageContent = await dataServicesPage.page.content();
      console.log("[Test] Page content length:", pageContent.length);

      // Check if there are any error messages
      const errorMessages = await dataServicesPage.page
        .locator('[role="alert"], .error, .alert')
        .allTextContents();
      if (errorMessages.length > 0) {
        console.log("[Test] Error messages found:", errorMessages);
      }

      // Check if the no results message is shown
      const noResultsVisible = await dataServicesPage
        .noResultsLocator()
        .isVisible();
      console.log("[Test] No results message visible:", noResultsVisible);
    }

    expect(cardCount).toBeGreaterThan(0);
  },
);
