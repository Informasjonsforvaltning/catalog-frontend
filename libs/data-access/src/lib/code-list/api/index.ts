import { CodeList } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';
import { validateOrganizationNumber, validateUUID } from '@catalog-frontend/utils';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getAllCodeLists = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getAllCodeLists');

  const resource = `${path}/${catalogId}/concepts/code-lists`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createCodeList = async (codeList: Partial<CodeList>, accessToken: string, catalogId: string) => {
  validateOrganizationNumber(catalogId, 'createCodeList');

  const resource = `${path}/${catalogId}/concepts/code-lists`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(codeList),
  };
  return await fetch(resource, options);
};

export const patchCodeList = async (catalogId: string, codeListId: string, accessToken: string, diff: Operation[]) => {
  validateOrganizationNumber(catalogId, 'patchCodeList');
  validateUUID(codeListId, 'patchCodeList');

  if (diff.length > 0) {
    const resource = `${path}/${catalogId}/concepts/code-lists/${codeListId}`;
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

export const deleteCodeList = async (catalogId: string, codeListId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'deleteCodeList');
  validateUUID(codeListId, 'deleteCodeList');

  const resource = `${path}/${catalogId}/concepts/code-lists/${codeListId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
