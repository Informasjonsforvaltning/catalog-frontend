import { Service } from '@catalog-frontend/types';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const handleGetAllPublicServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/public-services`;
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
  const resource = `${path}/catalogs/${catalogId}/public-services`;
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
  const resource = `${path}/catalogs/${catalogId}/public-services/${serviceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
