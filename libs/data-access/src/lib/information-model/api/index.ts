"use server";

import { InformationModel } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateInformationModelID,
  validateOrganizationNumber,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const path = `${process.env.CATALOG_BACKEND_BASE_URI}`;

export const getAllInformationModels = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllInformationModels");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllInformationModels",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["information-models"] },
  };
  return await fetch(resource, options);
};

export const getInformationModelById = async (
  catalogId: string,
  informationModelId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getInformationModelById");
  validateInformationModelID(informationModelId, "getInformationModelById");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getInformationModelById",
  );
  const encodedInformationModelId = validateAndEncodeUrlSafe(
    informationModelId,
    "information model ID",
    "getInformationModelById",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models/${encodedInformationModelId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["information-model"] },
  };
  return await fetch(resource, options);
};

export const postInformationModel = async (
  informationModel: Partial<InformationModel>,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "postInformationModel");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "postInformationModel",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(informationModel),
  };
  return await fetch(resource, options);
};

export const deleteInformationModel = async (
  catalogId: string,
  informationModelId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteInformationModel");
  validateInformationModelID(informationModelId, "deleteInformationModel");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteInformationModel",
  );
  const encodedInformationModelId = validateAndEncodeUrlSafe(
    informationModelId,
    "information model ID",
    "deleteInformationModel",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models/${encodedInformationModelId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return await fetch(resource, options);
};

export const updateInformationModel = async (
  catalogId: string,
  informationModelId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "updateInformationModel");
  validateInformationModelID(informationModelId, "updateInformationModel");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "updateInformationModel",
  );
  const encodedInformationModelId = validateAndEncodeUrlSafe(
    informationModelId,
    "information model ID",
    "updateInformationModel",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models/${encodedInformationModelId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(patchOperations),
  };
  return await fetch(resource, options);
};

export const publishInformationModel = async (
  catalogId: string,
  informationModelId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "publishInformationModel");
  validateInformationModelID(informationModelId, "publishInformationModel");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "publishInformationModel",
  );
  const encodedInformationModelId = validateAndEncodeUrlSafe(
    informationModelId,
    "information model ID",
    "publishInformationModel",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models/${encodedInformationModelId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return await fetch(resource, options);
};

export const unpublishInformationModel = async (
  catalogId: string,
  informationModelId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "unpublishInformationModel");
  validateInformationModelID(informationModelId, "unpublishInformationModel");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "unpublishInformationModel",
  );
  const encodedInformationModelId = validateAndEncodeUrlSafe(
    informationModelId,
    "information model ID",
    "unpublishInformationModel",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/information-models/${encodedInformationModelId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return await fetch(resource, options);
};
