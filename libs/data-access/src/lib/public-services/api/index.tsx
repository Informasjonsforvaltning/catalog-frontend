import { Service } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const handleGetAllPublicServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const handleGetPublicServiceById = async (catalogId: string, serviceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/public-services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const handleCreatePublicService = async (
  publicService: Partial<Service>,
  catalogId: string,
  accessToken: string,
) => {
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

export const handleDeletePublicService = async (catalogId: string, serviceId: string, accessToken: string) => {
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

export const handleUpdatePublicService = async (
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

export const handlePublishPublicService = async (catalogId: string, serviceId: string, accessToken: string) => {
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
