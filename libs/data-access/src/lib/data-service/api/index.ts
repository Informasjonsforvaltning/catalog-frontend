const oldPath = `${process.env.DATASERVICE_CATALOG_BASE_URI}`;
const path = `${process.env.DATA_SERVICE_CATALOG_BASE_URI}`;

export const oldGetAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${oldPath}/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const getAllDataServices = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/data-services`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-services'] },
  };
  return await fetch(resource, options);
};

export const getDataServiceById = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['data-service'] },
  };
  return await fetch(resource, options);
};

export const getAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${path}/internal/catalogs/count`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const deleteDataService = async (catalogId: string, dataServiceId: string, accessToken: string) => {
  const resource = `${path}/internal/catalogs/${catalogId}/data-services/${dataServiceId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
