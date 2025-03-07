'use server';

import {
  deleteDataService as removeDataService,
  getAllDataServices,
  postDataService,
  publishDataService as publish,
  unpublishDataService as unpublish,
  updateDataService as update,
} from '@catalog-frontend/data-access';
import { getValidSession, localization, redirectToSignIn, removeEmptyValues } from '@catalog-frontend/utils';
import { DataService, DataServiceToBeCreated } from '@catalog-frontend/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { compare } from 'fast-json-patch';

export async function getDataServices(catalogId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await getAllDataServices(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getDataServices failed with response code ' + response.status);
  }
  return await response.json();
}

export async function createDataService(catalogId: string, values: DataServiceToBeCreated) {
  const newDataService = removeEmptyValues({
    ...values,
    accessRights: values?.accessRights === 'none' ? undefined : values?.accessRights,
    license: values?.license === 'none' ? undefined : values?.license,
  });
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  let dataServiceId: undefined | string = undefined;
  try {
    const response = await postDataService(newDataService, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    dataServiceId = response?.headers?.get('location')?.split('/').pop();
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('data-service');
      revalidateTag('data-services');
      redirect(`/catalogs/${catalogId}/data-services/${dataServiceId}`);
    }
  }
}

export async function deleteDataService(catalogId: string, dataServiceId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeDataService(catalogId, dataServiceId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('data-services');
      redirect(`/catalogs/${catalogId}/data-services`);
    }
  }
}

export async function updateDataService(catalogId: string, initialDataService: DataService, values: DataService) {
  const updatedDataService = removeEmptyValues({
    ...values,
    accessRights: values?.accessRights === 'none' ? undefined : values?.accessRights,
    license: values?.license === 'none' ? undefined : values?.license,
  });

  const diff = compare(initialDataService, updatedDataService);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(catalogId, initialDataService.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    success = true;
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error(`Noe gikk galt, prøv igjen...`);
  }

  if (success) {
    revalidateTag('data-service');
    revalidateTag('data-services');
    redirect(`/catalogs/${catalogId}/data-services/${initialDataService.id}`);
  }
}

export async function publishDataService(catalogId: string, dataServiceId: string) {
  const session = await getValidSession();
  let success = false;
  try {
    const response = await publish(catalogId, dataServiceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('data-service');
      revalidateTag('data-services');
    }
  }
}

export async function unpublishDataService(catalogId: string, dataServiceId: string) {
  const session = await getValidSession();
  let success = false;
  try {
    const response = await unpublish(catalogId, dataServiceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('data-service');
      revalidateTag('data-services');
    }
  }
}
