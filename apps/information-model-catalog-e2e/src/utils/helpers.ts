import { APIRequestContext, APIResponse, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "path";
import {
  InformationModel,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";

export const adminAuthFile = path.join(
  __dirname,
  "../../.playwright/auth/admin.json",
);

export const TEST_TITLE_PREFIX = "test_informationmodel_";

export const getRunId = (): string => {
  const runId = process.env.E2E_RUN_ID;
  if (!runId) {
    throw new Error("E2E_RUN_ID must be set (see playwright.config.ts)");
  }
  return runId;
};

export const getRunTitlePrefix = () => `${TEST_TITLE_PREFIX}${getRunId()}_`;

const STALE_TEST_MODEL_AGE_MS = 2 * 60 * 60 * 1000;

export const getCatalogId = (): string => {
  const catalogId = process.env.E2E_CATALOG_ID;
  if (!catalogId) {
    throw new Error("E2E_CATALOG_ID must be set");
  }
  return catalogId;
};

const informationModelsApiUrl = () =>
  `/api/catalogs/${getCatalogId()}/information-models`;

export function uniqueString(prefix = "informationmodel") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
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

const assertOk = async (response: APIResponse, label: string) => {
  if (!response.ok()) {
    console.error(
      `[${label}] API call failed with status ${response.status()}`,
      await response.text(),
    );
    throw new Error(
      `[${label}] API call failed with status ${response.status()}`,
    );
  }
};

/** The fields the tests read from information models returned by the API. */
export type InformationModelSummary = Pick<
  InformationModel,
  "id" | "published" | "title" | "created"
>;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toInformationModelSummary = (
  value: unknown,
  label: string,
): InformationModelSummary => {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.published !== "boolean" ||
    !isRecord(value.title) ||
    (value.created !== undefined && typeof value.created !== "string")
  ) {
    throw new Error(
      `[${label}] Unexpected information model in response: ${JSON.stringify(value)}`,
    );
  }
  const title: InformationModel["title"] = {};
  for (const [language, text] of Object.entries(value.title)) {
    if (typeof text === "string") {
      title[language] = text;
    }
  }
  return {
    id: value.id,
    published: value.published,
    title,
    created: value.created,
  };
};

export const getInformationModels = async (
  apiRequestContext: APIRequestContext,
): Promise<InformationModelSummary[]> => {
  const label = "GET INFORMATION MODELS";
  const response = await apiRequestContext.get(informationModelsApiUrl());
  await assertOk(response, label);
  const body: unknown = await response.json();
  if (!Array.isArray(body)) {
    throw new Error(
      `[${label}] Expected an array, got: ${JSON.stringify(body)}`,
    );
  }
  return body.map((item) => toInformationModelSummary(item, label));
};

export const createInformationModel = async (
  apiRequestContext: APIRequestContext,
  informationModel: InformationModelToBeCreated,
): Promise<{ id: string }> => {
  const label = "CREATE INFORMATION MODEL";
  console.log(`[${label}] Creating information model:`, informationModel.title);
  const response = await apiRequestContext.post(informationModelsApiUrl(), {
    data: informationModel,
  });
  await assertOk(response, label);
  const body: unknown = await response.json();
  if (!isRecord(body) || typeof body.id !== "string") {
    throw new Error(
      `[${label}] Response has no information model id: ${JSON.stringify(body)}`,
    );
  }
  console.log(`[${label}] Created information model with ID:`, body.id);
  return { id: body.id };
};

export const deleteInformationModel = async (
  apiRequestContext: APIRequestContext,
  informationModelId: string,
) => {
  console.log(
    "[DELETE INFORMATION MODEL] Deleting information model:",
    informationModelId,
  );
  const response = await apiRequestContext.delete(
    `${informationModelsApiUrl()}/${informationModelId}`,
  );
  await assertOk(response, "DELETE INFORMATION MODEL");
};

export const unpublishInformationModel = async (
  apiRequestContext: APIRequestContext,
  informationModelId: string,
) => {
  console.log(
    "[UNPUBLISH INFORMATION MODEL] Unpublishing information model:",
    informationModelId,
  );
  const response = await apiRequestContext.post(
    `${informationModelsApiUrl()}/${informationModelId}/unpublish`,
  );
  await assertOk(response, "UNPUBLISH INFORMATION MODEL");
};

export const removeInformationModel = async (
  apiRequestContext: APIRequestContext,
  informationModel: Pick<InformationModel, "id" | "published">,
) => {
  if (informationModel.published) {
    await unpublishInformationModel(apiRequestContext, informationModel.id);
  }
  await deleteInformationModel(apiRequestContext, informationModel.id);
};

const titleStartsWith = (
  informationModel: InformationModelSummary,
  prefix: string,
) =>
  Object.values(informationModel.title).some(
    (value) => typeof value === "string" && value.startsWith(prefix),
  );

const createdAt = (informationModel: InformationModelSummary) => {
  const fromCreated = Date.parse(informationModel.created ?? "");
  if (!Number.isNaN(fromCreated)) {
    return fromCreated;
  }
  const fromTitle = Object.values(informationModel.title)
    .map((value) =>
      typeof value === "string" ? value.match(/_(\d{13})_[a-z0-9]+$/) : null,
    )
    .find((match) => match !== null)?.[1];
  return fromTitle ? Number(fromTitle) : undefined;
};

const isStale = (informationModel: InformationModelSummary) => {
  const created = createdAt(informationModel);
  // No usable timestamp: treat as an old leftover.
  return (
    created === undefined || Date.now() - created > STALE_TEST_MODEL_AGE_MS
  );
};

const removeInformationModels = async (
  apiRequestContext: APIRequestContext,
  label: string,
  shouldRemove: (informationModel: InformationModelSummary) => boolean,
) => {
  const models = (await getInformationModels(apiRequestContext)).filter(
    shouldRemove,
  );
  console.log(`[${label}] Found ${models.length} information models to remove`);
  for (const informationModel of models) {
    await removeInformationModel(apiRequestContext, informationModel);
  }
};

export const deleteTestInformationModelsFromThisRun = (
  apiRequestContext: APIRequestContext,
) => {
  const runPrefix = getRunTitlePrefix();
  return removeInformationModels(
    apiRequestContext,
    "DELETE TEST INFORMATION MODELS FROM THIS RUN",
    (informationModel) => titleStartsWith(informationModel, runPrefix),
  );
};

export const deleteStaleTestInformationModels = (
  apiRequestContext: APIRequestContext,
) => {
  const runPrefix = getRunTitlePrefix();
  return removeInformationModels(
    apiRequestContext,
    "DELETE STALE TEST INFORMATION MODELS",
    (informationModel) =>
      titleStartsWith(informationModel, runPrefix) ||
      (titleStartsWith(informationModel, TEST_TITLE_PREFIX) &&
        isStale(informationModel)),
  );
};
