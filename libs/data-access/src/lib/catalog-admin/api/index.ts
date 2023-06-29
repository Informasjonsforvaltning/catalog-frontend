export const getDesign = async (catalogId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}/${catalogId}/design`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    method: 'GET',
  };

  return await fetch(resource, options);
};

export const getDesignLogo = async (catalogId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}/${catalogId}/design/logo`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: '*/*',
    },
    method: 'GET',
  };

  return await fetch(resource, options);
};
