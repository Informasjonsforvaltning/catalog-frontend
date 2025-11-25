import { CodeList } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getAllCodeLists = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllCodeLists");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllCodeLists",
  );

  const resource = `${path}/${encodedCatalogId}/concepts/code-lists`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  return fetch(resource, options);
};

export const createCodeList = async (
  codeList: Partial<CodeList>,
  accessToken: string,
  catalogId: string,
) => {
  validateOrganizationNumber(catalogId, "createCodeList");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "createCodeList",
  );

  const resource = `${path}/${encodedCatalogId}/concepts/code-lists`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(codeList),
  };
  return fetch(resource, options);
};

export const patchCodeList = async (
  catalogId: string,
  codeListId: string,
  accessToken: string,
  diff: Operation[],
) => {
  validateOrganizationNumber(catalogId, "patchCodeList");
  validateUUID(codeListId, "patchCodeList");

  if (diff.length > 0) {
    const encodedCatalogId = validateAndEncodeUrlSafe(
      catalogId,
      "catalog ID",
      "patchCodeList",
    );
    const encodedCodeListId = validateAndEncodeUrlSafe(
      codeListId,
      "code list ID",
      "patchCodeList",
    );
    const resource = `${path}/${encodedCatalogId}/concepts/code-lists/${encodedCodeListId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(diff),
    };
    return fetch(resource, options);
  }
};

export const deleteCodeList = async (
  catalogId: string,
  codeListId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteCodeList");
  validateUUID(codeListId, "deleteCodeList");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteCodeList",
  );
  const encodedCodeListId = validateAndEncodeUrlSafe(
    codeListId,
    "code list ID",
    "deleteCodeList",
  );

  const resource = `${path}/${encodedCatalogId}/concepts/code-lists/${encodedCodeListId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(resource, options);
};
