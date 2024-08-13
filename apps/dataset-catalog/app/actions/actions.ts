'use server';

import { getAllDatasets as getAll } from '@catalog-frontend/data-access';
import { getValidSession } from '@catalog-frontend/utils';

export async function getDatasets(catalogId: string) {
  const session = await getValidSession();

  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error('getDatasets failed with response code ' + response.status);
  }
  const jsonResponse = await response.json();
  return jsonResponse._embedded.datasets;
}
