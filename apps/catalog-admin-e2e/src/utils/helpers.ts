import AxeBuilder from "@axe-core/playwright";
import { APIRequestContext, Page } from "@playwright/test";
import * as crypto from "crypto";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;

// Username and internal field names are validated against a regex that allows
// letters, spaces and hyphens only, so no digits or underscores
export function uniqueName(prefix = "test") {
  const letters = Array.from({ length: 12 }, () =>
    String.fromCharCode(97 + crypto.randomInt(0, 26)),
  ).join("");
  return `${prefix}-${letters}`;
}

export function uniqueString(prefix = "catalogAdmin") {
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

// Anything this suite creates is named with one of these. The e2e_ ones are from
// an earlier naming scheme and are kept so leftovers get cleaned up too.
const TEST_NAME_PREFIXES = [
  "testbruker-",
  "testfelt-",
  "e2e_user",
  "e2e_field",
  "e2e_code_list",
];

const catalogId = () => process.env.E2E_CATALOG_ID;

const isTestName = (name: unknown): boolean =>
  typeof name === "string" &&
  TEST_NAME_PREFIXES.some((prefix) => name.startsWith(prefix));

const label = (value: unknown): unknown =>
  value && typeof value === "object" && "nb" in value
    ? (value as { nb?: unknown }).nb
    : value;

const deleteLeftovers = async (
  apiRequestContext: APIRequestContext,
  resource: string,
  listKey: string,
  nameOf: (item: Record<string, unknown>) => unknown,
) => {
  const response = await apiRequestContext.get(
    `/api/${resource}/${catalogId()}`,
  );
  if (!response.ok()) {
    return;
  }
  const items = (await response.json())?.[listKey] ?? [];
  for (const item of items) {
    if (isTestName(nameOf(item))) {
      await apiRequestContext.delete(
        `/api/${resource}/${catalogId()}/${item.id}`,
      );
    }
  }
};

// Leftovers break the other suites: concept-catalog picks an assignee from the
// shared user list and reads the internal fields into its form.
export const deleteTestData = async (apiRequestContext: APIRequestContext) => {
  await deleteLeftovers(apiRequestContext, "users", "users", (u) => u.name);
  await deleteLeftovers(apiRequestContext, "internal-fields", "internal", (f) =>
    label(f.label),
  );
  await deleteLeftovers(
    apiRequestContext,
    "code-lists",
    "codeLists",
    (c) => c.name,
  );
};

export const getCodeLists = async (apiRequestContext: APIRequestContext) => {
  const response = await apiRequestContext.get(
    `/api/code-lists/${catalogId()}`,
  );
  return ((await response.json())?.codeLists ?? []) as {
    id: string;
    name: string;
  }[];
};

export const createCodeList = async (
  apiRequestContext: APIRequestContext,
  name: string,
) => {
  await apiRequestContext.post(`/api/code-lists/${catalogId()}`, {
    data: { codeList: { name, description: "e2e", codes: [] } },
  });
  const codeLists = await getCodeLists(apiRequestContext);
  return codeLists.find((c) => c.name === name)?.id as string;
};

export const deleteCodeList = async (
  apiRequestContext: APIRequestContext,
  id: string,
) => {
  await apiRequestContext.delete(`/api/code-lists/${catalogId()}/${id}`);
};

export const getEditableFields = async (
  apiRequestContext: APIRequestContext,
) => {
  const response = await apiRequestContext.get(
    `/api/internal-fields/${catalogId()}`,
  );
  return (await response.json())?.editable ?? {};
};

export const setDomainCodeListId = async (
  apiRequestContext: APIRequestContext,
  value: string,
) => {
  await apiRequestContext.patch(`/api/editable-fields/${catalogId()}`, {
    data: {
      diff: [{ op: "replace", path: "/domainCodeListId", value: value ?? "" }],
    },
  });
};

export const getDesign = async (apiRequestContext: APIRequestContext) => {
  const response = await apiRequestContext.get(`/api/design/${catalogId()}`);
  return response.ok() ? await response.json() : {};
};

export const setDesignColors = async (
  apiRequestContext: APIRequestContext,
  backgroundColor: string,
  fontColor: string,
) => {
  await apiRequestContext.patch(`/api/design/${catalogId()}`, {
    data: [
      { op: "replace", path: "/backgroundColor", value: backgroundColor },
      { op: "replace", path: "/fontColor", value: fontColor },
    ],
  });
};
