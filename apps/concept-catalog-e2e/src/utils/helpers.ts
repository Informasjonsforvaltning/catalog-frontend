import AxeBuilder from "@axe-core/playwright";
import { Concept, FieldsResult, UsersResult } from "@catalog-frontend/types";
import { APIRequestContext, Page } from "@playwright/test";
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

export const clearCombobox = async (page: Page, label: string) => {
  // Use getByLabel as primary locator — more stable with Designsystemet's
  // Combobox where nested <label> from TitleWithHelpTextAndTag can break
  // getByRole accessible name resolution.
  const combobox = page.getByLabel(label);
  await combobox.fill("");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
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

export enum ConceptStatus {
  DRAFT = "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
  CANDIDATE = "http://publications.europa.eu/resource/authority/concept-status/CANDIDATE",
  WAITING = "http://publications.europa.eu/resource/authority/concept-status/WAITING",
  CURRENT = "http://publications.europa.eu/resource/authority/concept-status/CURRENT",
  RETIRED = "http://publications.europa.eu/resource/authority/concept-status/RETIRED",
  REJECTED = "internal codes - REJECTED",
}
