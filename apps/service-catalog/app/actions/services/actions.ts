'use server';

import {
  createService as create,
  deleteService as removeService,
  getAllServices as getAll,
  getServiceById as getById,
  publishService as publish,
  unpublishService as unpublish,
  updateService as update,
} from '@catalog-frontend/data-access';
import { Service, ServiceToBeCreated } from '@catalog-frontend/types';
import { getValidSession, localization, redirectToSignIn, removeEmptyValues } from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getServices(catalogId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }

  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getServices failed with response code ' + response.status);
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getServiceById(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  const response = await getById(catalogId, serviceId, `${session?.accessToken}`);

  if (response.status !== 200) {
    throw new Error('getServiceById failed with response code ' + response.status);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function createService(catalogId: string, values: ServiceToBeCreated) {
  const newService = removeEmptyValues(values);
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  let success = false;
  let serviceId = undefined;
  try {
    const response = await create(newService, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    serviceId = response?.headers?.get('location')?.split('/').pop();
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
      redirect(`/catalogs/${catalogId}/services/${serviceId}`);
    }
  }
}

export async function deleteService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('services');
      redirect(`/catalogs/${catalogId}/services`);
    }
  }
}

export async function updateService(catalogId: string, oldService: Service, values: Service) {
  const updatedService = removeEmptyValues(values);

  const updatedServiceMerged = {
    ...oldService,
    title: updatedService.title,
    description: updatedService.description,
    produces: updatedService.produces,
    contactPoints: updatedService.contactPoints,
    homepage: updatedService.homepage,
    status: updatedService.status,
  };

  const diff = compare(oldService, updatedServiceMerged);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(catalogId, oldService.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error(`${response.statusText}`);
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
      redirect(`/catalogs/${catalogId}/services/${oldService.id}`);
    }
  }
}

export async function publishService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
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
      revalidateTag('service');
      revalidateTag('services');
    }
  }
}

export async function unpublishService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
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
      revalidateTag('service');
      revalidateTag('services');
    }
  }
}
