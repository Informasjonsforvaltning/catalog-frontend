const apiGetCall = async (resource: string, accessToken: string) => {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    method: 'GET',
  };

  return await fetch(resource, options);
};

export const getDesign = async (catalogId: string, accessToken: string) =>
  apiGetCall(`${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}/${catalogId}/design`, accessToken);

export const getDesignLogo = async (catalogId: string, accessToken: string) =>
  apiGetCall(`${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}/${catalogId}/design/logo`, accessToken);
