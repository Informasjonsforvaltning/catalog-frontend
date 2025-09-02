import { Service } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';
import { validateOrganizationNumber, validateUUID, validateAndEncodeUrlSafe } from '@catalog-frontend/utils';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const getAllServices = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getAllServices');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'getAllServices');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['services'] },
  };
  return await fetch(resource, options);
};

export const getServiceById = async (catalogId: string, serviceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getServiceById');
  validateUUID(serviceId, 'getServiceById');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'getServiceById');
  const encodedServiceId = validateAndEncodeUrlSafe(serviceId, 'service ID', 'getServiceById');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services/${encodedServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['service'] },
  };
  return await fetch(resource, options);
};

export const createService = async (Service: Partial<Service>, catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'createService');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'createService');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(Service),
  };
  return await fetch(resource, options);
};

export const deleteService = async (catalogId: string, serviceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'deleteService');
  validateUUID(serviceId, 'deleteService');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'deleteService');
  const encodedServiceId = validateAndEncodeUrlSafe(serviceId, 'service ID', 'deleteService');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services/${encodedServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const updateService = async (
  catalogId: string,
  serviceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, 'updateService');
  validateUUID(serviceId, 'updateService');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'updateService');
  const encodedServiceId = validateAndEncodeUrlSafe(serviceId, 'service ID', 'updateService');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services/${encodedServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(patchOperations),
  };
  return await fetch(resource, options);
};

export const publishService = async (catalogId: string, serviceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'publishService');
  validateUUID(serviceId, 'publishService');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'publishService');
  const encodedServiceId = validateAndEncodeUrlSafe(serviceId, 'service ID', 'publishService');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services/${encodedServiceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const unpublishService = async (catalogId: string, serviceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'unpublishService');
  validateUUID(serviceId, 'unpublishService');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'unpublishService');
  const encodedServiceId = validateAndEncodeUrlSafe(serviceId, 'service ID', 'unpublishService');

  const resource = `${path}/internal/catalogs/${encodedCatalogId}/services/${encodedServiceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const getAllServiceCatalogs = async (accessToken: string) => {
  const resource = `${path}/internal/catalogs/count`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  return await fetch(resource, options);
};
