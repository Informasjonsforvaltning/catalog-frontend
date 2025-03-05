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

export const getDesign = async (catalogId: string, accessToken: string, envVariable?: string) =>
  apiGetCall(`${envVariable ?? path}/${catalogId}/design`, accessToken);

export const getDesignLogo = async (catalogId: string, accessToken: string) =>
  apiGetCall(`${path}/${catalogId}/design/logo`, accessToken);

export const getBase64DesignLogo = async (catalogId: string, accessToken: string) => {
  const arrayBufferToBase64 = (buffer: ArrayBuffer, mimeType: string) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return `data:${mimeType};base64,${btoa(binary)}`;
  };

  try {
    const response = await getDesignLogo(catalogId, accessToken);
    if (response.status !== 200) {
      if(response.status !== 404) {
        console.error("Failed to get design logo, status: ", response.status);
      }
      return null;
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType) {
      console.error('Failed to get design logo: missing Content-Type header');
      return null;
    }

    const arrayBufferResponse = await response.arrayBuffer();
    return arrayBufferToBase64(arrayBufferResponse, contentType);
  } catch (error) {
    console.error('Failed to get design logo:', error);
    return null; // or handle fallback
  }
};

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
  const res = await fetch(resource, options);
  return res;
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
