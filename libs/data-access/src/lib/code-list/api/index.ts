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
    `${process.env.CATALOG_ADMIN_BASE_URI}/${catalogId}${path}`,

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

// export const searchCodelistsForCatalog = async (catalogId: string, query: SearchConceptQuery, accessToken: string) =>
//   await conceptCatalogApiCall('POST', `/begreper/search?orgNummer=${catalogId}`, query, accessToken)
//     .then((res) => (res.status === 200 ? res.json() : null))
//     .catch((err) => {
//       console.error('searchConceptsForCatalog failed with: ', err);
//       return Promise.reject(err);
//     });

// export const getCodeListById = async (codeListId: string, accessToken: string, catalogId: number) =>
//   await codeListCatalogApiCall('GET', `/concepts/code-lists/${codeListId}`, null, accessToken, catalogId)
//     .then((res) => (res.status === 200 ? res.json() : null))
//     .catch((err) => {
//       console.error('getCodeListById failed with: ', err);
//       return Promise.reject(err);
//     });

// export const importConcepts = async (concepts: Omit<Concept, 'id'>[], accessToken: string) =>
//   await conceptCatalogApiCall('POST', `/begreper/import`, concepts, accessToken).catch((err) => {
//     console.error('importConcepts failed with: ', err);
//     return Promise.reject(err);
//   });

// export const patchCodeList = async (codeListId: string, accessToken: string, value: String) =>
//   await codeListCatalogApiCall('PATCH', `/concepts/code-lists/${codeListId}`, value, accessToken)
//     .then((res) => (res.status === 200 ? res.json() : []))
//     .catch((err) => {
//       console.error('getConceptRevisions failed with: ', err);
//       return Promise.reject(err);
//     });

export const patchCodeList = async (
  catalogId: string,
  codeListId: string,
  accessToken: string,
  //oldCodeList: CodeList,
  //newCodeList: CodeList,
  diff: Operation[],
) => {
  //const diff = compare(oldCodeList, newCodeList);
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
