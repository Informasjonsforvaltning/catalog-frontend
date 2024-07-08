'use server';

import {
  createPublicService as create,
  deletePublicService as deletePS,
  getAllPublicServices as getAll,
  getPublicServiceById as getById,
  publishPublicService as publish,
  unpublishPublicService as unpublish,
  updatePublicService as update,
} from '@catalog-frontend/data-access';
import { Service, ServiceToBeCreated } from '@catalog-frontend/types';
import { removeEmptyValues, localization, getValidSessionForAction } from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getPublicServices(catalogId: string) {
  const session = await getValidSessionForAction();
  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getPublicServices failed with response code ' + response.status);
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getPublicServiceById(catalogId: string, serviceId: string) {
  const session = await getValidSessionForAction();
  const response = await getById(catalogId, serviceId, `${session?.accessToken}`);

  if (response.status !== 200) {
    throw new Error('getPublicServiceById failed with response code ' + response.status);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function createPublicService(catalogId: string, values: ServiceToBeCreated) {
  const newPublicService = removeEmptyValues(values);
  const session = await getValidSessionForAction();
  let success = false;
  let serviceId = undefined;
  try {
    const response = await create(newPublicService, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    serviceId = response?.headers?.get('location')?.split('/').pop();
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('public-service');
      revalidateTag('public-services');
      redirect(`/catalogs/${catalogId}/public-services/${serviceId}`);
    }
  }
}

export async function deletePublicService(catalogId: string, serviceId: string) {
  const session = await getValidSessionForAction();
  let success = false;
  try {
    const response = await deletePS(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('public-services');
      redirect(`/catalogs/${catalogId}/public-services`);
    }
  }
}

export async function updatePublicService(catalogId: string, oldPublicService: Service, values: Service) {
  const updatedService = removeEmptyValues(values);

  const updatedPublicServiceMerged = {
    ...oldPublicService,
    title: updatedService.title,
    description: updatedService.description,
    produces: updatedService.produces,
    contactPoints: updatedService.contactPoints,
    homepage: updatedService.homepage,
    status: updatedService.status,
  };

  const diff = compare(oldPublicService, updatedPublicServiceMerged);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;

  const session = await getValidSessionForAction();
  try {
    const response = await update(catalogId, oldPublicService.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('public-service');
      revalidateTag('public-services');
      redirect(`/catalogs/${catalogId}/public-services/${oldPublicService.id}`);
    }
  }
}

export async function publishPublicService(catalogId: string, serviceId: string) {
  const session = await getValidSessionForAction();
  let success = false;
  try {
    const response = await publish(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.publishFail);
  } finally {
    if (success) {
      revalidateTag('public-service');
      revalidateTag('public-services');
    }
  }
}

export async function unpublishPublicService(catalogId: string, serviceId: string) {
  const session = await getValidSessionForAction();
  let success = false;
  try {
    const response = await unpublish(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.unpublishFail);
  } finally {
    if (success) {
      revalidateTag('public-service');
      revalidateTag('public-services');
    }
  }
}
