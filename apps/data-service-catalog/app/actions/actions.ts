'use server';

import { getAllDataServices } from '@catalog-frontend/data-access';
import { getValidSession } from '@catalog-frontend/utils';

export async function getDataServices(catalogId: string) {
  const session = await getValidSession();

  const response = await getAllDataServices(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getDataServices failed with response code ' + response.status);
  }
  return await response.json();
}
