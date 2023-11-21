import { Service } from '@catalog-frontend/types';

const path = `${process.env.SERVICE_CATALOG_BASE_URI}`;

export const getAllPublicServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const createPublicService = async (publicService: Partial<Service>, catalogId: string, accessToken: string) => {
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
