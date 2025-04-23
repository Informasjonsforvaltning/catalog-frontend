export const getOrganizations = async (organizationIds: string[] | null = null) => {
  let resource;
  
  if(organizationIds === null) {
    resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations`
  } else if (organizationIds.length > 0) {
    resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations?organizationId=${organizationIds}`;
  } else {
    return Promise.reject('Organization ids cannot be empty');
  }
    
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'no-cache' as RequestCache,
  };
  return await fetch(resource, options); 
};

export const getOrganization = async (organizationId: string) => {
  if (RegExp(/^\d{9}$/).exec(organizationId)) {
    const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations/${organizationId}`;
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-cache' as RequestCache,
    };
    return await fetch(resource, options);
  }

  return Promise.reject('Invalid organization id');
};
