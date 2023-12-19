'use server';

import {
  authOptions,
  hasOrganizationWritePermission,
  validOrganizationNumber,
  validUUID,
  validateSession,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { acceptChangeRequest, rejectChangeRequest } from '@catalog-frontend/data-access';
import { revalidateTag } from 'next/cache';

export async function acceptChangeRequestAction(catalogId: string, changeRequestId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);

  if (!validOrganizationNumber(catalogId)) throw new Error('Invalid catalogId');
  if (!validUUID(changeRequestId)) throw new Error('Invalid changeRequestId');
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error('User does not have write permission for this catalog');

  try {
    const response = await acceptChangeRequest(catalogId, changeRequestId, `${session?.accessToken}`);
  } catch (error) {
    throw new Error(error);
  } finally {
    revalidateTag('concept-change-requests');
    revalidateTag('concept-change-request');
  }
}

export async function rejectChangeRequestAction(catalogId: string, changeRequestId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);

  if (!validOrganizationNumber(catalogId)) throw new Error('Invalid catalogId');
  if (!validUUID(changeRequestId)) throw new Error('Invalid changeRequestId');
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error('User does not have write permission for this catalog');

  try {
    const response = await rejectChangeRequest(catalogId, changeRequestId, `${session?.accessToken}`);
  } catch (error) {
    throw new Error(error);
  } finally {
    revalidateTag('concept-change-requests');
    revalidateTag('concept-change-request');
  }
}
