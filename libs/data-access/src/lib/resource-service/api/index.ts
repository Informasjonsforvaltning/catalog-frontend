export const getResourceByUri = async (uri: string): Promise<Response> => {
  if (!uri) {
    throw new Error('URI is required for getResourceByUri');
  }

  if (!process.env.FDK_RESOURCE_SERVICE_BASE_URI) {
    throw new Error('FDK_RESOURCE_SERVICE_BASE_URI environment variable is not set');
  }

  const encodedUri = encodeURIComponent(uri);
  const resource = `${process.env.FDK_RESOURCE_SERVICE_BASE_URI}/v1/resources/by-uri?uri=${encodedUri}`;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'GET',
  };

  return await fetch(resource, options);
};
