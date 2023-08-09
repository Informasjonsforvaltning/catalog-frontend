import { Field } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getFields = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/concepts/fields`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createInternalField = async (field: Partial<Field>, accessToken: string, catalogId: string) => {
  const resource = `${path}/${catalogId}/concepts/fields/internal`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(field),
  };
  return await fetch(resource, options);
};

export const patchInternalField = async (
  catalogId: string,
  fieldId: string,
  accessToken: string,
  diff: Operation[],
) => {
  if (diff.length > 0) {
    const resource = `${path}/${catalogId}/concepts/fields/internal/${fieldId}`;
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

export const deleteInternalField = async (catalogId: string, fieldId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/concepts/fields/internal/${fieldId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const patchEditableField = async (catalogId: string, accessToken: string, diff: Operation[]) => {
  if (diff.length > 0) {
    const resource = `${path}/${catalogId}/concepts/fields/editable`;
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
