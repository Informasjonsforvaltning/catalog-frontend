import AxeBuilder from "@axe-core/playwright";
import { ServiceToBeCreated } from "@catalog-frontend/types";
import { APIRequestContext, Locator, Page } from "@playwright/test";
import * as crypto from "crypto";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;
export const writeAuthFile = `${__dirname}/../../.playwright/auth/write.json`;
export const readAuthFile = `${__dirname}/../../.playwright/auth/read.json`;

// Helper to generate a unique, random string
export function uniqueString(prefix = "service") {
  return `${prefix}_${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 10)}_${Date.now()}`;
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
  switch (uri) {
    case "http://purl.org/adms/status/Completed":
      return "Ferdigstilt";
    case "http://purl.org/adms/status/Deprecated":
      return "Frarådet";
    case "http://purl.org/adms/status/UnderDevelopment":
      return "Under utvikling";
    case "http://purl.org/adms/status/Withdrawn":
      return "Trukket tilbake";
    default:
      return "Ukjent";
  }
};

export const getParentLocator = (locator: Locator, n: number = 1) => {
  let parent = locator;
  for (let i = 0; i < n; i++) {
    parent = parent.locator("..");
  }
  return parent;
};

export const deleteAllServices = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/services`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const services = await response.json();
  for (const service of services) {
    await apiRequestContext.delete(
      `/api/catalogs/${process.env.E2E_CATALOG_ID}/services/${service.id}`,
    );
  }
};

export const deleteAllPublicServices = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/public-services`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const services = await response.json();
  for (const service of services) {
    await apiRequestContext.delete(
      `/api/catalogs/${process.env.E2E_CATALOG_ID}/public-services/${service.id}`,
    );
  }
};

export const deleteService = async (
  apiRequestContext: APIRequestContext,
  serviceId: string,
) => {
  await apiRequestContext.delete(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/services/${serviceId}`,
  );
};

export const deletePublicService = async (
  apiRequestContext: APIRequestContext,
  serviceId: string,
) => {
  await apiRequestContext.delete(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/public-services/${serviceId}`,
  );
};

export const createService = async (
  apiRequestContext: APIRequestContext,
  service: Partial<ServiceToBeCreated>,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/services`,
    {
      data: service,
    },
  );

  if (!response.ok()) {
    console.error(
      `API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export const createPublicService = async (
  apiRequestContext: APIRequestContext,
  service: ServiceToBeCreated,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/public-services`,
    {
      data: service,
    },
  );

  if (!response.ok()) {
    console.error(
      `API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export const publishService = async (
  apiRequestContext: APIRequestContext,
  serviceId: string,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/services/${serviceId}/publish`,
  );

  if (!response.ok()) {
    console.error(
      `API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export const publishPublicService = async (
  apiRequestContext: APIRequestContext,
  serviceId: string,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}public-services/${serviceId}/publish`,
  );

  if (!response.ok()) {
    console.error(
      `API call failed with status ${response.status()}`,
      await response.json(),
    );
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export enum ServiceStatus {
  COMPLETED = "http://purl.org/adms/status/Completed",
  DEPRECATED = "http://purl.org/adms/status/Deprecated",
  UNDER_DEVELOPMENT = "http://purl.org/adms/status/UnderDevelopment",
  WITHDRAWN = "http://purl.org/adms/status/Withdrawn",
}
