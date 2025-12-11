import AxeBuilder from "@axe-core/playwright";
import {
  Concept,
  FieldsResult,
  ImportResult,
  UsersResult,
} from "@catalog-frontend/types";
import { APIRequestContext, Locator, Page, expect } from "@playwright/test";
import * as crypto from "crypto";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;
export const writeAuthFile = `${__dirname}/../../.playwright/auth/write.json`;
export const readAuthFile = `${__dirname}/../../.playwright/auth/read.json`;

// Helper to generate a unique, random string
export function uniqueString(prefix = "concept") {
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

export const getParentLocator = (locator: Locator, n = 1) => {
  let parent = locator;
  for (let i = 0; i < n; i++) {
    parent = parent.locator("..");
  }
  return parent;
};

export const clearCombobox = async (page: Page, label: string) => {
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

export const relationToSourceText = (relationToSource?: string) => {
  if (relationToSource === "egendefinert") {
    return "Egendefinert";
  } else if (relationToSource === "basertPaaKilde") {
    return "Basert på kilde";
  }
  if (relationToSource === "sitatFraKilde") {
    return "Sitat fra kilde";
  }
  return null;
};

export const deleteAllConcepts = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const concepts: Concept[] = await response.json();
  for (const concept of concepts) {
    if (!concept.erPublisert) {
      await apiRequestContext.delete(
        `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`,
      );
    }
  }
};

export const deleteConcept = async (
  apiRequestContext: APIRequestContext,
  conceptId: string,
) => {
  await apiRequestContext.delete(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${conceptId}`,
  );
};

export const createConcept = async (
  apiRequestContext: APIRequestContext,
  concept: Partial<Concept>,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts`,
    {
      data: concept,
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

export const getPublishedConcept = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const concepts: Concept[] = await response.json();
  return concepts.filter((c) => c.erPublisert).pop();
};

export const publishConcept = async (
  apiRequestContext: APIRequestContext,
  conceptId: string,
) => {
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${conceptId}/publish`,
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

export const getUsers = async (apiRequestContext: APIRequestContext) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/users`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const result = (await response.json()) as UsersResult;
  return result;
};

export const getFields = async (apiRequestContext: APIRequestContext) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/fields`,
  );
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const result = (await response.json()) as FieldsResult;
  return result;
};

const getAccessToken = async (apiRequestContext: APIRequestContext) => {
  const session = await apiRequestContext.get("/api/auth/session");
  const accessToken = (await session.json())?.accessToken;

  return accessToken;
};

export const getImportResults = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`,
  );

  console.log("Response status for importing RDF results ", response.status);

  return response.json();
};

async function deleteImportResult(
  apiRequestContext: APIRequestContext,
  resultId: string,
) {
  const response = await apiRequestContext.delete(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results/${resultId}`,
  );

  console.log(
    "Import result delete response status ",
    response.status,
    " for import result ",
    resultId,
  );

  console.log("Deleted import result ", resultId);
}

export const deleteAllImportResults = async (
  apiRequestContext: APIRequestContext,
) => {
  try {
    const importResults: ImportResult[] =
      await getImportResults(apiRequestContext);

    for (const importResult of importResults) {
      await deleteImportResult(apiRequestContext, importResult?.id);
    }
  } catch (error) {
    console.log("[TEST] No import results to remove: ", error);
  }
};

export enum ConceptStatus {
  DRAFT = "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
  CANDIDATE = "http://publications.europa.eu/resource/authority/concept-status/CANDIDATE",
  WAITING = "http://publications.europa.eu/resource/authority/concept-status/WAITING",
  CURRENT = "http://publications.europa.eu/resource/authority/concept-status/CURRENT",
  RETIRED = "http://publications.europa.eu/resource/authority/concept-status/RETIRED",
  REJECTED = "internal codes - REJECTED",
}
