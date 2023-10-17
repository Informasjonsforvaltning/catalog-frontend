const path = `${process.env.CONCEPT_CATALOG_BASE_URI}`;

export const getChangeRequests = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getChangeRequest = async (catalogId: string, changeRequestId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createChangeRequest = async (body: any, catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: body,
  };
  return await fetch(resource, options);
};

export const updateChangeRequest = async (
  body: any,
  catalogId: string,
  changeRequestId: string,
  accessToken: string,
) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: body,
  };
  return await fetch(resource, options);
};
