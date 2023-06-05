export const getHistory = async (catalogId: string, resourceId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_HISTORY_SERVICE_BASE_URI}/${catalogId}/${resourceId}/updates`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  const response = await fetch(resource, options)
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.error('getHistory failed with: ', err));

  return response;
};
