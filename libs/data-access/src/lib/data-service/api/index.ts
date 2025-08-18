'use server';

import { DataService } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';
import { validateOrganizationNumber } from '@catalog-frontend/utils';

const oldPath = `${process.env.DATASERVICE_CATALOG_BASE_URI}`;
const path = `${process.env.DATA_SERVICE_CATALOG_BASE_URI}`;

export const oldGetAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${oldPath}/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const getAllDataServices = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getAllDataServices');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-services'] },
  };
  return await fetch(resource, options);
};

export const getDataServiceById = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getDataServiceById');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-service'] },
  };
  return await fetch(resource, options);
};

export const postDataService = async (dataService: Partial<DataService>, catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'postDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(dataService),
  };
  return await fetch(resource, options);
};

export const importDataService = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, 'importDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/import`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
    },
    method: 'POST',
    body: fileContent,
  };

  return await fetch(resource, options).then((res) => res.headers.get('location'));
};

export const getAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${path}/internal/catalogs/count`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const deleteDataService = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'deleteDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const updateDataService = async (
  catalogId: string,
  dataServiceId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, 'updateDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}`;
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

export const publishDataService = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'publishDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const unpublishDataService = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'unpublishDataService');

  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const getDataServiceImportResults = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getDataServiceImportResults');

  const resource = `${path}/internal/catalogs/${catalogId}/import/results`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['import-results'] },
  };
  return await fetch(resource, options);
};

export const getDataServiceImportResultById = async (catalogId: string, resultId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getDataServiceImportResultById');

  const resource = `${path}/internal/catalogs/${catalogId}/import/results/${resultId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['import-result'] },
  };
  return await fetch(resource, options);
};

export const deleteImportResult = async (catalogId: string, resultId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'deleteImportResult');

  const resource = `${path}/internal/catalogs/${catalogId}/import/results/${resultId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
