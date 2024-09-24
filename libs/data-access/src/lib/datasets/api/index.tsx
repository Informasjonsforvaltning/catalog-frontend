import { Dataset } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.DATASET_CATALOG_BASE_URI}`;

export const getAllDatasets = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['datasets'] },
  };
  return await fetch(resource, options);
};

export const getById = async (catalogId: string, datasetId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets/${datasetId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['dataset'] },
  };
  return await fetch(resource, options);
};

export const postDataset = async (Dataset: Partial<Dataset>, catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(Dataset),
  };
  return await fetch(resource, options);
};

export const deleteDataset = async (catalogId: string, datasetId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets/${datasetId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const updateDataset = async (
  catalogId: string,
  datasetId: string,
  patchOperations: Operation[],
  accessToken: string,
) => {
  const resource = `${path}/catalogs/${catalogId}/datasets/${datasetId}`;
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

export const publishDataset = async (catalogId: string, datasetId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets/${datasetId}/publish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const unpublishDataset = async (catalogId: string, datasetId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/datasets/${datasetId}/unpublish`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  return await fetch(resource, options);
};

export const getAllDatasetCatalogs = async (accessToken: string) => {
  const resource = `${path}/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['dataset-catalogs'] },
  };
  return await fetch(resource, options);
};
