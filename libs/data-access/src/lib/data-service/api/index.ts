"use server";

import { DataService } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const oldPath = `${process.env.DATASERVICE_CATALOG_BASE_URI}`;
const path = `${process.env.DATA_SERVICE_CATALOG_BASE_URI}`;

export const oldGetAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${oldPath}/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(resource, options);
};

export const getAllDataServices = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllDataServices");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllDataServices",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["data-services"] },
  };
  return fetch(resource, options);
};

export const getDataServiceById = async (
  catalogId: string,
  dataServiceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getDataServiceById");
  validateUUID(dataServiceId, "getDataServiceById");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getDataServiceById",
  );
  const encodedDataServiceId = validateAndEncodeUrlSafe(
    dataServiceId,
    "data service ID",
    "getDataServiceById",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services/${encodedDataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["data-service"] },
  };
  return fetch(resource, options);
};

export const postDataService = async (
  dataService: Partial<DataService>,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "postDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "postDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(dataService),
  };
  return fetch(resource, options);
};

export const importDataService = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "importDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "importDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/import`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    },
    method: "POST",
    body: fileContent,
  };

  return fetch(resource, options).then((res) => res.headers.get("location"));
};

export const getAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${path}/internal/catalogs/count`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(resource, options);
};

export const deleteDataService = async (
  catalogId: string,
  dataServiceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteDataService");
  validateUUID(dataServiceId, "deleteDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteDataService",
  );
  const encodedDataServiceId = validateAndEncodeUrlSafe(
    dataServiceId,
    "data service ID",
    "deleteDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services/${encodedDataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(resource, options);
};

export const updateDataService = async (
  catalogId: string,
  dataServiceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "updateDataService");
  validateUUID(dataServiceId, "updateDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "updateDataService",
  );
  const encodedDataServiceId = validateAndEncodeUrlSafe(
    dataServiceId,
    "data service ID",
    "updateDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services/${encodedDataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(patchOperations),
  };
  return fetch(resource, options);
};

export const publishDataService = async (
  catalogId: string,
  dataServiceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "publishDataService");
  validateUUID(dataServiceId, "publishDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "publishDataService",
  );
  const encodedDataServiceId = validateAndEncodeUrlSafe(
    dataServiceId,
    "data service ID",
    "publishDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services/${encodedDataServiceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return fetch(resource, options);
};

export const unpublishDataService = async (
  catalogId: string,
  dataServiceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "unpublishDataService");
  validateUUID(dataServiceId, "unpublishDataService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "unpublishDataService",
  );
  const encodedDataServiceId = validateAndEncodeUrlSafe(
    dataServiceId,
    "data service ID",
    "unpublishDataService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/data-services/${encodedDataServiceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return fetch(resource, options);
};

export const getDataServiceImportResults = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getDataServiceImportResults");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getDataServiceImportResults",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/import/results`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["import-results"] },
  };
  return fetch(resource, options);
};

export const getDataServiceImportResultById = async (
  catalogId: string,
  resultId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getDataServiceImportResultById");
  validateUUID(resultId, "getDataServiceImportResultById");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getDataServiceImportResultById",
  );
  const encodedResultId = validateAndEncodeUrlSafe(
    resultId,
    "result ID",
    "getDataServiceImportResultById",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/import/results/${encodedResultId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["import-result"] },
  };
  return fetch(resource, options);
};

export const deleteImportResult = async (
  catalogId: string,
  resultId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteImportResult");
  validateUUID(resultId, "deleteImportResult");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteImportResult",
  );
  const encodedResultId = validateAndEncodeUrlSafe(
    resultId,
    "result ID",
    "deleteImportResult",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/import/results/${encodedResultId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(resource, options);
};
