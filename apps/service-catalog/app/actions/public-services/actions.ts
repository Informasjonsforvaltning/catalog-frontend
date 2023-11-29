'use server';

import {
  handleCreatePublicService,
  handleDeletePublicService,
  handleGetAllPublicServices,
  handleGetPublicServiceById,
  handlePublishPublicService,
  handleUpdatePublicService,
} from '@catalog-frontend/data-access';
import { Service, ServiceToBeCreated } from '@catalog-frontend/types';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getPublicServices(catalogId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await handleGetAllPublicServices(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}

export async function getPublicServiceById(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await handleGetPublicServiceById(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}

export async function createPublicService(catalogId: string, formData: FormData) {
  const newPublicService: ServiceToBeCreated = {
    catalogId: catalogId,
    title: {
      nb: formData.get('title.nb'),
    },
    description: {
      nb: formData.get('description.nb'),
    },
  };

  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handleCreatePublicService(newPublicService, catalogId, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    return;
  } finally {
    if (success) {
      revalidatePath(`/catalogs/${catalogId}/public-services`);
      redirect(`/catalogs/${catalogId}/public-services`);
    }
  }
}

export async function deletePublicService(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handleDeletePublicService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error();
  } finally {
    if (success) {
      revalidatePath(`/catalogs/${catalogId}/public-services`);
      redirect(`/catalogs/${catalogId}/public-services`);
    }
  }
}

export async function updatePublicService(catalogId: string, oldPublicService: Service, formData: FormData) {
  const updatedPublicService = { ...oldPublicService };
  updatedPublicService.title = {
    ...updatedPublicService.title,
    nb: formData.get('title.nb'),
  };

  updatedPublicService.description = {
    ...updatedPublicService.description,
    nb: formData.get('description.nb'),
  };

  const diff = compare(oldPublicService, updatedPublicService);
  let success = false;

  const session = await getServerSession(authOptions);
  await validateSession(session);

  try {
    const response = await handleUpdatePublicService(catalogId, oldPublicService.id, diff, `${session?.accessToken}`);
    console.log(response.status);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    return;
  } finally {
    if (success) {
      revalidatePath(`/catalogs/${catalogId}/public-services`);
      revalidatePath(`/catalogs/${catalogId}/public-services/${oldPublicService.id}`);
      redirect(`/catalogs/${catalogId}/public-services`);
    }
  }
}

export async function publishPublicService(catalogId: string, serviceId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  let success = false;
  try {
    const response = await handlePublishPublicService(catalogId, serviceId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error();
  } finally {
    if (success) {
      revalidatePath(`/catalogs/${catalogId}/public-services/${serviceId}`);
    }
  }
}
