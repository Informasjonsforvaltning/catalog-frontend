import { Concept, Relasjon, SearchConceptQuery, SkosConcept } from '@catalog-frontend/types';
import { searchConceptsByIdentifiers } from '../../search-fulltext/api';
import { isObjectNullUndefinedEmpty } from '@catalog-frontend/utils';

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

export const extractConcepts = (searchResponse: any) => searchResponse?.hits ?? [];

const hasRelatedConcepts = (concept: Concept): boolean => {
  if (!isObjectNullUndefinedEmpty(concept.begrepsRelasjon)) return true;
  if (!isObjectNullUndefinedEmpty(concept.seOgså)) return true;
  if (!isObjectNullUndefinedEmpty(concept.erstattesAv)) return true;
  return false;
};

export const getConceptRelations = (concept: Concept): Relasjon[] => {
  if (!hasRelatedConcepts(concept)) return [];

  const conceptRelations: Relasjon[] = [];

  if (concept.begrepsRelasjon) {
    conceptRelations.push(...concept.begrepsRelasjon.filter((relasjon) => !isObjectNullUndefinedEmpty(relasjon)));
  }

  if (concept.seOgså) {
    if (Array.isArray(concept.seOgså)) {
      conceptRelations.push(...concept.seOgså.map((uri): Relasjon => ({ relatertBegrep: uri, relasjon: 'seOgså' })));
    } else {
      conceptRelations.push({ relatertBegrep: concept.seOgså, relasjon: 'seOgså' });
    }
  }

  if (concept.erstattesAv) {
    conceptRelations.push(
      ...concept.erstattesAv.map((uri): Relasjon => ({ relatertBegrep: uri, relasjon: 'erstattesAv' })),
    );
  }

  return conceptRelations;
};

export const getRelatedConcepts = async (concept: Concept): Promise<SkosConcept[]> => {
  if (!hasRelatedConcepts(concept)) return [];

  const relatedConceptsUris = [];

  if (concept.begrepsRelasjon)
    relatedConceptsUris.push(
      ...concept.begrepsRelasjon
        .map((relasjon) => relasjon.relatertBegrep)
        .filter((value) => value !== null && value !== undefined),
    );

  if (concept.seOgså) {
    if (Array.isArray(concept.seOgså)) {
      relatedConceptsUris.push(...concept.seOgså);
    } else {
      relatedConceptsUris.push(concept.seOgså);
    }
  }

  if (concept.erstattesAv) {
    relatedConceptsUris.push(...concept.erstattesAv);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const relatedConcepts = await searchConceptsByIdentifiers(relatedConceptsUris)
    .then(async (response) => await (response instanceof Response && response.ok ? response.json() : []))
    .then((body) => extractConcepts(body));

  return relatedConcepts;
};
