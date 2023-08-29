import { Operation } from 'fast-json-patch';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

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
  apiGetCall(`${path}/${catalogId}/design`, accessToken);

export const getDesignLogo = async (catalogId: string, accessToken: string) =>
  apiGetCall(`${path}/${catalogId}/design/logo`, accessToken);

export const patchDesign = async (catalogId: string, accessToken: string, diff: Operation[]) => {
  if (diff) {
    const resource = `${path}/${catalogId}/design`;
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(diff),
    };
    return await fetch(resource, options);
  }
};

export const postDesignLogo = async (catalogId: string, accessToken: string, logo: any) => {
  const resource = `${path}/${catalogId}/design/logo`;

  const formData = new FormData();
  formData.append('logo', logo);

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: formData,
  };
  return await fetch(resource, options);
};

export const deleteDesignLogo = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/design/logo`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const deleteLogo = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/design/logo`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
