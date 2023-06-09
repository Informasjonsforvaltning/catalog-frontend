export const getOrganization = async (organizationId: string) => {
  if (organizationId.match(/^\d{9}$/)) {
    const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations/${organizationId}`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-cache' as RequestCache,
    };
    const response = await fetch(resource, options)
      .then((res) => {
        return res.status === 200 && res.json();
      })
      .catch((err) => console.error('getOrganization failed with: ', err));

    return response;
  }

  return Promise.reject('Invalid organization id');
};