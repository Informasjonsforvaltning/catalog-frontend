import { Service } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const getAllPublicServices = async (
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getAllPublicServices");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getAllPublicServices",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["public-services"] },
  };
  return fetch(resource, options);
};

export const getPublicServiceById = async (
  catalogId: string,
  serviceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "getPublicServiceById");
  validateUUID(serviceId, "getPublicServiceById");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getPublicServiceById",
  );
  const encodedServiceId = validateAndEncodeUrlSafe(
    serviceId,
    "service ID",
    "getPublicServiceById",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services/${encodedServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["public-service"] },
  };
  return fetch(resource, options);
};

export const createPublicService = async (
  publicService: Partial<Service>,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "createPublicService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "createPublicService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(publicService),
  };
  return fetch(resource, options);
};

export const deletePublicService = async (
  catalogId: string,
  serviceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deletePublicService");
  validateUUID(serviceId, "deletePublicService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deletePublicService",
  );
  const encodedServiceId = validateAndEncodeUrlSafe(
    serviceId,
    "service ID",
    "deletePublicService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services/${encodedServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(resource, options);
};

export const updatePublicService = async (
  catalogId: string,
  serviceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "updatePublicService");
  validateUUID(serviceId, "updatePublicService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "updatePublicService",
  );
  const encodedServiceId = validateAndEncodeUrlSafe(
    serviceId,
    "service ID",
    "updatePublicService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services/${encodedServiceId}`;
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

export const publishPublicService = async (
  catalogId: string,
  serviceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "publishPublicService");
  validateUUID(serviceId, "publishPublicService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "publishPublicService",
  );
  const encodedServiceId = validateAndEncodeUrlSafe(
    serviceId,
    "service ID",
    "publishPublicService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services/${encodedServiceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return fetch(resource, options);
};

export const unpublishPublicService = async (
  catalogId: string,
  serviceId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "unpublishPublicService");
  validateUUID(serviceId, "unpublishPublicService");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "unpublishPublicService",
  );
  const encodedServiceId = validateAndEncodeUrlSafe(
    serviceId,
    "service ID",
    "unpublishPublicService",
  );

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/public-services/${encodedServiceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  };
  return fetch(resource, options);
};
