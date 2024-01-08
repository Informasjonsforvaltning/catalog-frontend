import { Service } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const getAllPublicServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['public-services'] },
  };
  return await fetch(resource, options);
};

export const getPublicServiceById = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['public-service'] },
  };
  return await fetch(resource, options);
};

export const createPublicService = async (publicService: Partial<Service>, catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(publicService),
  };
  return await fetch(resource, options);
};

export const deletePublicService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const updatePublicService = async (
  catalogId: string,
  serviceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}`;
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

export const publishPublicService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const unpublishPublicService = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};
