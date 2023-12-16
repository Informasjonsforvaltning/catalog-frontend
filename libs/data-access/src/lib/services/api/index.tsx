import { Service } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const handleGetAllServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['services'] },
  };
  return await fetch(resource, options);
};

export const handleGetServiceById = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['service'] },
  };
  return await fetch(resource, options);
};

export const handleCreateService = async (Service: Partial<Service>, catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services`;
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

export const handleDeleteService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const handleUpdateService = async (
  catalogId: string,
  serviceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services/${serviceId}`;
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

export const handlePublishService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services/${serviceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const handleUnpublishService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/services/${serviceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};
