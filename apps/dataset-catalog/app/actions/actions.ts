'use server';

import {
  deleteDataset as removeDataset,
  getAllDatasets as getAll,
  getById,
  postDataset,
  updateDataset as update,
} from '@catalog-frontend/data-access';
import { Dataset, DatasetToBeCreated } from '@catalog-frontend/types';
import {
  convertListToListOfObjects,
  getValidSession,
  localization,
  redirectToSignIn,
  removeEmptyValues,
  transformToLocalizedStrings,
} from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getDatasets(catalogId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getDatasets failed with response code ' + response.status);
  }
  const jsonResponse = await response.json();
  return jsonResponse._embedded.datasets;
}

export async function getDatasetById(catalogId: string, datasetId: string): Promise<Dataset> {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  const response = await getById(catalogId, datasetId, `${session?.accessToken}`);

  if (response.status !== 200) {
    throw new Error('getDatasetById failed with response code ' + response.status);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function createDataset(values: DatasetToBeCreated, catalogId: string) {
  const newDataset = {
    ...values,
    keyword: values?.keywordList ? transformToLocalizedStrings(values?.keywordList) : undefined,
    concepts: values?.conceptList ? convertListToListOfObjects(values.conceptList, 'uri') : undefined,
    spatial: values?.spatialList ? convertListToListOfObjects(values.spatialList, 'uri') : undefined,
    language: values.languageList ? convertListToListOfObjects(values.languageList, 'uri') : undefined,
    accessRights: { uri: values?.accessRights?.uri === 'none' ? undefined : values?.accessRights?.uri },
  };
  const datasetNoEmptyValues = removeEmptyValues(newDataset);

  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  let success = false;
  let datasetId = undefined;
  try {
    const response = await postDataset(datasetNoEmptyValues, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }

    const data = await response.json();
    datasetId = data.id;

    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('dataset');
      revalidateTag('datasets');
      redirect(`/catalogs/${catalogId}/datasets/${datasetId}`);
    }
  }
}

export async function deleteDataset(catalogId: string, datasetId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeDataset(catalogId, datasetId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('datasets');
      redirect(`/catalogs/${catalogId}/datasets`);
    }
  }
}

export async function updateDataset(catalogId: string, initialDataset: Dataset, values: Dataset) {
  const updatedDataset = removeEmptyValues({
    ...values,
    keyword: values?.keywordList ? transformToLocalizedStrings(values?.keywordList) : undefined,
    concepts: values?.conceptList ? convertListToListOfObjects(values.conceptList, 'uri') : undefined,
    spatial: values?.spatialList ? convertListToListOfObjects(values.spatialList, 'uri') : undefined,
    language: values.languageList ? convertListToListOfObjects(values.languageList, 'uri') : undefined,
    accessRights: { uri: values?.accessRights?.uri === 'none' ? undefined : values?.accessRights?.uri },
  });

  const diff = compare(initialDataset, updatedDataset);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(catalogId, initialDataset.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    success = true;
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error(`Noe gikk galt, prøv igjen...`);
  }

  if (success) {
    revalidateTag('dataset');
    revalidateTag('datasets');
    redirect(`/catalogs/${catalogId}/datasets/${initialDataset.id}`);
  }
}

export async function publishDataset(catalogId: string, initialDataset: Dataset, values: Dataset) {
  const diff = compare(initialDataset, values);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(catalogId, initialDataset.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error(`Noe gikk galt, prøv igjen...`);
  }
}
