const path = `${process.env.DATA_SERVICE_CATALOG_BASE_URI}`;

export const getAllDataServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/dataservices`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-services'] },
  };
  return await fetch(resource, options);
};

export const getDataserviceById = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  const resource = `${path}/catalogs/${catalogId}/dataservices/${dataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-services'] },
  };
  return await fetch(resource, options);
};
