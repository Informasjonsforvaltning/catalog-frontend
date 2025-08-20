import { InternalField } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';
import { validateOrganizationNumber, validateUUID, validateAndEncodeUrlSafe } from '@catalog-frontend/utils';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getFields = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getFields');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'getFields');

  const resource = `${path}/${encodedCatalogId}/concepts/fields`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createInternalField = async (field: Partial<InternalField>, accessToken: string, catalogId: string) => {
  validateOrganizationNumber(catalogId, 'createInternalField');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'createInternalField');

  const resource = `${path}/${encodedCatalogId}/concepts/fields/internal`;
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
  validateOrganizationNumber(catalogId, 'patchInternalField');
  validateUUID(fieldId, 'patchInternalField');

  if (diff.length > 0) {
    const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'patchInternalField');
    const encodedFieldId = validateAndEncodeUrlSafe(fieldId, 'field ID', 'patchInternalField');
    const resource = `${path}/${encodedCatalogId}/concepts/fields/internal/${encodedFieldId}`;
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
  validateOrganizationNumber(catalogId, 'deleteInternalField');
  validateUUID(fieldId, 'deleteInternalField');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'deleteInternalField');
  const encodedFieldId = validateAndEncodeUrlSafe(fieldId, 'field ID', 'deleteInternalField');

  const resource = `${path}/${encodedCatalogId}/concepts/fields/internal/${encodedFieldId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};

export const patchEditableFields = async (catalogId: string, accessToken: string, diff: Operation[]) => {
  validateOrganizationNumber(catalogId, 'patchEditableFields');

  if (diff.length > 0) {
    const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'patchEditableFields');
    const resource = `${path}/${encodedCatalogId}/concepts/fields/editable`;
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
