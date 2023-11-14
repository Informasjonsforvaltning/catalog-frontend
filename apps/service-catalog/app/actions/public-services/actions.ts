'use server';

import { getAllPublicServices } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';

export async function getPublicServices(caralogId: string) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  try {
    const response = await getAllPublicServices(caralogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return;
  }
}
