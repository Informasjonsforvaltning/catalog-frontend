import { CodeList, Concept, SearchConceptQuery } from '@catalog-frontend/types';
import _ from 'lodash';
import { Operation } from 'fast-json-patch';

export const codeListCatalogApiCall = async (
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  path: string,
  body: any,
  accessToken: string,
  catalogId: string,
) =>
  await fetch(
    `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}/${catalogId}${path}`,

    Object.assign(
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method,
        cache: 'no-cache' as RequestCache,
      },
      body ? { body: JSON.stringify(body) } : {},
    ),
  );

export const getAllCodeLists = async (catalogId: string, accessToken: string) =>
  await codeListCatalogApiCall('GET', '/concepts/code-lists', null, accessToken, catalogId)
    .then((res) => (res.status === 200 ? res.json() : null))
    .catch((err) => {
      console.error('getAllCodeLists failed with: ', err);
      return Promise.reject(err);
    });

export const createCodeList = (codeList: Partial<CodeList>, accessToken: string, catalogId: string) =>
  codeListCatalogApiCall('POST', `/concepts/code-lists`, codeList, accessToken, catalogId).catch((err) => {
    console.error('createConcept failed with: ', err);
    return Promise.reject(err);
  });

export const patchCodeList = async (catalogId: string, codeListId: string, accessToken: string, diff: Operation[]) => {
  if (diff.length > 0) {
    try {
      await codeListCatalogApiCall('PATCH', `/concepts/code-lists/${codeListId}`, diff, accessToken, catalogId);
    } catch (err) {
      console.error('patchCodeList failed with: ', err);
      return Promise.reject(err);
    }
  }
};

export const deleteCodeList = async (catalogId: string, codeListId: string, accessToken: string) =>
  await codeListCatalogApiCall('DELETE', `/concepts/code-lists/${codeListId}`, null, accessToken, catalogId).catch(
    (err) => {
      console.error('deleteCodeList failed with: ', err);
      return Promise.reject(err);
    },
  );
