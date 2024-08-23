const path = `${process.env.DATASERVICE_CATALOG_BASE_URI}`;

export const getAllDataServiceCatalogs = async (accessToken: string) => {
  const resource = `${path}/catalogs`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};
