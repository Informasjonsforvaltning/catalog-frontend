export const getHistory = async (catalogId: string, resourceId: string, accessToken: string, page = 1, size = 10) => {
  const resource = `${process.env.CATALOG_HISTORY_SERVICE_BASE_URI}/${catalogId}/${resourceId}/updates?page=${page}&size=${size}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  return fetch(resource, options);
};
