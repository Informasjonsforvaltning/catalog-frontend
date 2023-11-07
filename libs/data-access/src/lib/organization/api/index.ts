export const getOrganizations = async (organizationIds: string[]) => {
  if (organizationIds.length > 0) {
    const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations?organizationId=${organizationIds}`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-cache' as RequestCache,
    };
    return await fetch(resource, options);
  }

  return Promise.reject('Organization ids cannot be empty');
};

export const getOrganization = async (organizationId: string) => {
  if (RegExp(/^\d{9}$/).exec(organizationId)) {
    const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations/${organizationId}`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-cache' as RequestCache,
    };
    return await fetch(resource, options);
  }

  return Promise.reject('Invalid organization id');
};
