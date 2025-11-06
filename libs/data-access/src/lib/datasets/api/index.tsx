import { Dataset } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const path = `${process.env.DATASET_CATALOG_BASE_URI}`;

export const getAllDatasets = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllDatasets");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllDatasets",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["datasets"] },
  };
  return await fetch(resource, options);
};

export const getById = async (
  catalogId: string,
  datasetId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getById");
  validateUUID(datasetId, "getById");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getById",
  );
  const encodedDatasetId = validateAndEncodeUrlSafe(
    datasetId,
    "dataset ID",
    "getById",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets/${encodedDatasetId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["dataset"] },
  };
  return await fetch(resource, options);
};

export const postDataset = async (
  Dataset: Partial<Dataset>,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "postDataset");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "postDataset",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(Dataset),
  };
  return await fetch(resource, options);
};

export const deleteDataset = async (
  catalogId: string,
  datasetId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteDataset");
  validateUUID(datasetId, "deleteDataset");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteDataset",
  );
  const encodedDatasetId = validateAndEncodeUrlSafe(
    datasetId,
    "dataset ID",
    "deleteDataset",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets/${encodedDatasetId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return await fetch(resource, options);
};

export const updateDataset = async (
  catalogId: string,
  datasetId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "updateDataset");
  validateUUID(datasetId, "updateDataset");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "updateDataset",
  );
  const encodedDatasetId = validateAndEncodeUrlSafe(
    datasetId,
    "dataset ID",
    "updateDataset",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets/${encodedDatasetId}`;
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

export const publishDataset = async (
  catalogId: string,
  datasetId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "publishDataset");
  validateUUID(datasetId, "publishDataset");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "publishDataset",
  );
  const encodedDatasetId = validateAndEncodeUrlSafe(
    datasetId,
    "dataset ID",
    "publishDataset",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets/${encodedDatasetId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return await fetch(resource, options);
};

export const unpublishDataset = async (
  catalogId: string,
  datasetId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "unpublishDataset");
  validateUUID(datasetId, "unpublishDataset");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "unpublishDataset",
  );
  const encodedDatasetId = validateAndEncodeUrlSafe(
    datasetId,
    "dataset ID",
    "unpublishDataset",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/datasets/${encodedDatasetId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return await fetch(resource, options);
};

export const getAllDatasetCatalogs = async (accessToken: string) => {
  const resource = `${path}/internal/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["dataset-catalogs"] },
  };
  return await fetch(resource, options);
};

export const getAllDatasetSeries = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllDatasetSeries");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllDatasetSeries",
  );

  const resource = `${path}/catalogs/${encodedCatalogId}/datasets?specializedType=SERIES`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["datasetSeries"] },
  };
  return await fetch(resource, options);
};
