const path = `${process.env.SERVICE_CATALOG_SERVICE_BASE_URI}`;

export const getAllPublicServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/public-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};
