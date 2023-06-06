export const getOrganization = async (organizationId: string) => {
  const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations/${organizationId}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'no-cache' as RequestCache
  };
  const response = await fetch(resource, options)
    .then((res) => {
      console.log(res.text);
      return res.status === 200 && res.json();
    })
    .catch((err) => console.error('getOrganization failed with: ', err));

  return response;
};
