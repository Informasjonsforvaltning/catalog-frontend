'use server';

import {
  deleteConcept as deleteConceptApi,
  createConcept as createConceptApi,
  patchConcept as patchConceptApi
} from '@catalog-frontend/data-access';
import { Concept } from '@catalog-frontend/types';
import { getValidSession, localization, removeEmptyValues } from '@catalog-frontend/utils';
import { compare } from 'fast-json-patch';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createConcept(values: Concept, catalogId: string) {
  const conceptNoEmptyValues = removeEmptyValues(values);

  const session = await getValidSession();
  let success = false;
  let conceptId: string | undefined = undefined;
  try {
    const response = await createConceptApi(conceptNoEmptyValues, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error();
    }
    conceptId = response?.headers?.get('location')?.split('/').pop();
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      revalidateTag('concept');
      revalidateTag('concepts');
      redirect(`/catalogs/${catalogId}/concepts/${conceptId}`);
    }
  }
}

export async function deleteConcept(catalogId: string, conceptId: string) {
  const session = await getValidSession();
  let success = false;
  try {
    const response = await deleteConceptApi(conceptId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFail);
  } finally {
    if (success) {
      revalidateTag('concepts');
      redirect(`/catalogs/${catalogId}/concepts`);
    }
  }
}

export async function updateConcept(catalogId: string, initialConcept: Concept, values: Concept) {
  if(!initialConcept.id) {
    throw new Error('Concept id cannot be null');
  }

  const diff = compare(initialConcept, values);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;
  const session = await getValidSession();

  try {
    const response = await patchConceptApi(initialConcept.id, diff, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    success = true;
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error(`Noe gikk galt, prøv igjen...`);
  }

  if (success) {
    revalidateTag('concept');
    revalidateTag('concepts');
    redirect(`/catalogs/${catalogId}/concepts/${initialConcept.id}`);
  }
}
