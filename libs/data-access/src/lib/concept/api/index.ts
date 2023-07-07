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

export const searchConceptsForCatalog = (catalogId: string, query: SearchConceptQuery, accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper/search?orgNummer=${catalogId}`, query, accessToken);

export const getConcept = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('GET', `/begreper/${conceptId}`, null, accessToken);

export const getConceptRevisions = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('GET', `/begreper/${conceptId}/revisions`, null, accessToken);

export const createConcept = (concept: Partial<Concept>, accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper`, concept, accessToken);

export const importConcepts = (concepts: Omit<Concept, 'id'>[], accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper/import`, concepts, accessToken);

export const deleteConcept = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('DELETE', `/begreper/${conceptId}`, null, accessToken);
