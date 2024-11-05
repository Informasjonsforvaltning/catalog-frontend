'use server';

import {
  deleteDataService as removeDataService,
  getAllDataServices,
  getDataServiceById,
} from '@catalog-frontend/data-access';
import { getValidSession, localization } from '@catalog-frontend/utils';
import { DataService } from '@catalog-frontend/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getDataServices(catalogId: string) {
  const session = await getValidSession();

  const response = await getAllDataServices(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getDataServices failed with response code ' + response.status);
  }
  return await response.json();
}

export async function getDataService(catalogId: string, dataServiceId: string): Promise<DataService> {
  const session = await getValidSession();
  const response = await getDataServiceById(catalogId, dataServiceId, `${session?.accessToken}`);

  if (response.status !== 200) {
    throw new Error('getDataService failed with response code ' + response.status);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function deleteDataService(catalogId: string, dataServiceId: string) {
  const session = await getValidSession();
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
