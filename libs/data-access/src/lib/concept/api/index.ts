import { Concept, SearchConceptQuery } from '@catalog-frontend/types';

export const conceptCatalogApiCall = async (
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  body: any,
  accessToken: string,
) =>
  await fetch(
    `${process.env.CONCEPT_CATALOG_BASE_URI}${path}`,
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

export const searchConceptsForCatalog = async (catalogId: string, query: SearchConceptQuery, accessToken: string) =>
  await conceptCatalogApiCall('POST', `/begreper/search?orgNummer=${catalogId}`, query, accessToken)
    .then((res) => (res.status === 200 ? res.json() : null))
    .catch((err) => {
      console.error('searchConceptsForCatalog failed with: ', err);
      return Promise.reject(err);
    });

export const getConcept = async (conceptId: string, accessToken: string) =>
  await conceptCatalogApiCall('GET', `/begreper/${conceptId}`, null, accessToken)
    .then((res) => (res.status === 200 ? res.json() : null))
    .catch((err) => {
      console.error('getConcept failed with: ', err);
      return Promise.reject(err);
    });

export const getConceptRevisions = async (conceptId: string, accessToken: string) =>
  await conceptCatalogApiCall('GET', `/begreper/${conceptId}/revisions`, null, accessToken)
    .then((res) => (res.status === 200 ? res.json() : []))
    .catch((err) => {
      console.error('getConceptRevisions failed with: ', err);
      return Promise.reject(err);
    });

export const createConcept = (concept: Partial<Concept>, accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper`, concept, accessToken).catch((err) => {
    console.error('createConcept failed with: ', err);
    return Promise.reject(err);
  });

export const importConcepts = async (concepts: Omit<Concept, 'id'>[], accessToken: string) =>
  await conceptCatalogApiCall('POST', `/begreper/import`, concepts, accessToken).catch((err) => {
    console.error('importConcepts failed with: ', err);
    return Promise.reject(err);
  });

export const deleteConcept = async (conceptId: string, accessToken: string) =>
  await conceptCatalogApiCall('DELETE', `/begreper/${conceptId}`, null, accessToken).catch((err) => {
    console.error('deleteConcept failed with: ', err);
    return Promise.reject(err);
  });
