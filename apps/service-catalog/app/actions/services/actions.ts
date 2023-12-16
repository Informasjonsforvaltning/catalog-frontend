'use server';

import {
  handleCreateService,
  handleDeleteService,
  handleGetAllServices,
  handleGetServiceById,
  handlePublishService,
  handleUnpublishService,
  handleUpdateService,
} from '@catalog-frontend/data-access';
import { Service, ServiceToBeCreated } from '@catalog-frontend/types';
import { authOptions, removeEmptyValues, validateSession } from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import _ from 'lodash';
import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getServices(catalogId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await handleGetAllServices(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}

export async function getServiceById(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await handleGetServiceById(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}

export async function createService(catalogId: string, values: ServiceToBeCreated) {
  const newService = removeEmptyValues(values);
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handleCreateService(newService, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    return;
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
      redirect(`/catalogs/${catalogId}/services`);
    }
  }
}

export async function deleteService(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handleDeleteService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error();
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

  let success = false;

  const session = await getServerSession(authOptions);
  await validateSession(session);

  try {
    const response = await handleUpdateService(catalogId, oldService.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    return;
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
      redirect(`/catalogs/${catalogId}/services`);
    }
  }
}

export async function publishService(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handlePublishService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error();
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
    }
  }
}

export async function unpublishService(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handleUnpublishService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error();
  } finally {
    if (success) {
      revalidateTag('service');
      revalidateTag('services');
    }
  }
}
