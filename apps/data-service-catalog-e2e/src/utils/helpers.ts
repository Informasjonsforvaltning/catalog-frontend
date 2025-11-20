import { expect, Page, Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "path";

export const adminAuthFile = path.join(
  process.cwd(),
  "apps/data-service-catalog-e2e/.playwright/auth/admin.json",
);
export const writeAuthFile = path.join(
  process.cwd(),
  "apps/data-service-catalog-e2e/.playwright/auth/write.json",
);
export const readAuthFile = path.join(
  process.cwd(),
  "apps/data-service-catalog-e2e/.playwright/auth/read.json",
);

export function uniqueString(prefix = "dataservice") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const generateAccessibilityBuilder = async (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);

export const getStatusText = (uri: string): string => {
  const statusMap: Record<string, string> = {
    "http://purl.org/adms/status/Completed": "Godkjent",
    "http://purl.org/adms/status/UnderDevelopment": "Under utvikling",
    "http://purl.org/adms/status/Withdrawn": "Trukket",
    "http://purl.org/adms/status/Deprecated": "Utgått",
    "http://purl.org/adms/status/Discontinued": "Avsluttet",
  };
  return statusMap[uri] || "Ukjent";
};

export const getParentLocator = (locator: Locator, n = 1) => {
  let parent = locator;
  for (let i = 0; i < n; i++) {
    parent = parent.locator("..");
  }
  return parent;
};

export const clearCombobox = async (page, label) => {
  // Workaround to clear and close a combobox.
  const currentValue = await page
    .getByRole("combobox", { name: label })
    .inputValue();
  await page.getByRole("combobox", { name: label }).click();

  for (let i = 0; i < currentValue.length; i++) {
    await page.getByLabel(label).press("Backspace");
  }
  await expect(page.getByLabel(label)).toHaveValue("");
  await page.getByLabel(label).press("Tab");
};

export const deleteAllDataServices = async (apiRequestContext) => {
  console.log(
    "[DELETE ALL DATA SERVICES] Starting deletion of all data services...",
  );

  try {
    const response = await apiRequestContext.get(
      `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services`,
    );
    if (!response.ok()) {
      throw new Error(`API call failed with status ${response.status()}`);
    }

    const dataServices = await response.json();
    console.log(dataServices);
    console.log(
      `[DELETE ALL DATA SERVICES] Found ${dataServices.length} data services`,
    );
    for (const dataService of dataServices) {
      if (!dataService.published) {
        console.log(
          `[DELETE ALL DATA SERVICES] Deleting data service: ${dataService.id}`,
        );
        await apiRequestContext.delete(
          `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services/${dataService.id}`,
        );
      }
    }

    console.log(
      "[DELETE ALL DATA SERVICES] All data services deleted successfully",
    );
  } catch (error) {
    console.error(
      "[DELETE ALL DATA SERVICES] Error deleting data services:",
      error,
    );
    throw error;
  }
};

export const deleteDataService = async (apiRequestContext, dataServiceId) => {
  console.log("[DELETE DATA SERVICE] Deleting data service:", dataServiceId);
  await apiRequestContext.delete(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services/${dataServiceId}`,
  );
  console.log("[DELETE DATA SERVICE] Data service deleted successfully");
};

export const createDataService = async (apiRequestContext, dataService) => {
  console.log(
    "[CREATE DATA SERVICE] Creating data service:",
    dataService.title,
  );
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services`,
    {
      data: dataService,
    },
  );

  if (!response.ok()) {
    console.error(
      `[CREATE DATA SERVICE] API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const createdDataService = await response.json();
  console.log(
    "[CREATE DATA SERVICE] Data service created successfully with ID:",
    createdDataService.id,
  );

  return createdDataService;
};

export const getPublishedDataService = async (apiRequestContext) => {
  console.log("[GET PUBLISHED DATA SERVICE] Fetching published data services");
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services`,
  );
  if (!response.ok()) {
    console.error(
      "[GET PUBLISHED DATA SERVICE] API call failed with status",
      response.status(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const dataServices = await response.json();
  const publishedDataService = dataServices.filter((d) => d.published).pop();
  console.log(
    "[GET PUBLISHED DATA SERVICE] Found published data service:",
    publishedDataService?.id,
  );
  return publishedDataService;
};

export const publishDataService = async (apiRequestContext, dataServiceId) => {
  console.log("[PUBLISH DATA SERVICE] Publishing data service:", dataServiceId);
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/data-services/${dataServiceId}/publish`,
  );

  if (!response.ok()) {
    console.error(
      `[PUBLISH DATA SERVICE] API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  console.log("[PUBLISH DATA SERVICE] Data service published successfully");
};

export const getUsers = async (apiRequestContext) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/users`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const result = await response.json();
  return result;
};

// Date utility functions copied from @catalog-frontend/utils
export const dateStringToDate = (dateString: string) => {
  const dateStringTimestamp = Date.parse(dateString);
  const date = new Date(dateStringTimestamp);
  date.setHours(0, 0, 0, 0);
  return !isNaN(dateStringTimestamp) ? date : null;
};

export const formatDate = (date: Date | null) =>
  date
    ? date
        .toLocaleDateString("nb-NO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join(".")
    : "";
