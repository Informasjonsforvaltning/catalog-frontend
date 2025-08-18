import { validateOrganizationNumber, validateUUID } from '@catalog-frontend/utils';

export const getHistory = async (catalogId: string, resourceId: string, accessToken: string, page = 1, size = 10) => {
  validateOrganizationNumber(catalogId, 'getHistory');
  validateUUID(resourceId, 'getHistory');

  const encodedPage = encodeURIComponent(page.toString());
  const encodedSize = encodeURIComponent(size.toString());
  const resource = `${process.env.CATALOG_HISTORY_SERVICE_BASE_URI}/${catalogId}/${resourceId}/updates?page=${encodedPage}&size=${encodedSize}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  return fetch(resource, options);
};
