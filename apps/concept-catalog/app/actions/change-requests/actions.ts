'use server';

import {
  getValidSession,
  hasOrganizationWritePermission,
  redirectToSignIn,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { acceptChangeRequest, rejectChangeRequest } from '@catalog-frontend/data-access';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function acceptChangeRequestAction(catalogId: string, changeRequestId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error('Invalid catalogId');
  if (!validUUID(changeRequestId)) throw new Error('Invalid changeRequestId');
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error('User does not have write permission for this catalog');

  try {
    await acceptChangeRequest(catalogId, changeRequestId, `${session?.accessToken}`);
  } catch (error) {
    throw new Error(error);
  } finally {
    revalidateTag('concept-change-requests');
    revalidateTag('concept-change-request');
  }
}

export async function rejectChangeRequestAction(catalogId: string, changeRequestId: string) {
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error('Invalid catalogId');
  if (!validUUID(changeRequestId)) throw new Error('Invalid changeRequestId');
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error('User does not have write permission for this catalog');

  try {
    await rejectChangeRequest(catalogId, changeRequestId, `${session?.accessToken}`);
  } catch (error) {
    throw new Error(error);
  } finally {
    revalidateTag('concept-change-requests');
    revalidateTag('concept-change-request');
  }
}
