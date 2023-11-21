'use server';

import { createPublicService, getAllPublicServices } from '@catalog-frontend/data-access';
import { ServiceToBeCreated } from '@catalog-frontend/types';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getPublicServices(catalogId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await getAllPublicServices(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}

export async function createNewPublicService(catalogId: string, formData: FormData) {
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
    const response = await createPublicService(newPublicService, catalogId, `${session?.accessToken}`);
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
