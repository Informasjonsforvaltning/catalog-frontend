import { Concept, Relasjon, SearchConceptQuery, SkosConcept } from '@catalog-frontend/types';
import { searchConceptsByIdentifiers } from '../../search-fulltext/api';
import { isObjectNullUndefinedEmpty } from '@catalog-frontend/utils';

export const conceptCatalogApiCall = async (
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  body: any,
  accessToken: string,
) =>
  await fetch(`${process.env.CONCEPT_CATALOG_BASE_URI}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method,
    cache: 'no-cache' as RequestCache,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

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

export const publishConcept = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper/${conceptId}/publish`, null, accessToken);

export const extractConcepts = (searchResponse: any) => searchResponse?.hits ?? [];

export const searchInternalConcepts = (catalogId: string, body: string[], accessToken: string): Promise<Response> =>
  conceptCatalogApiCall(
    'POST',
    `/begreper/search?orgNummer=${catalogId}`,
    {
      filters: {
        originalId: { value: body },
      },
      pagination: {
        size: body.length,
      },
    },
    accessToken,
  );

const hasRelatedConcepts = (concept: Concept): boolean => {
  if (!isObjectNullUndefinedEmpty(concept.begrepsRelasjon)) return true;
  if (!isObjectNullUndefinedEmpty(concept.seOgså)) return true;
  if (!isObjectNullUndefinedEmpty(concept.erstattesAv)) return true;
  return false;
};

const hasRelatedInternalConcepts = (concept: Concept): boolean => {
  if (!isObjectNullUndefinedEmpty(concept.internBegrepsRelasjon)) return true;
  if (!isObjectNullUndefinedEmpty(concept.internSeOgså)) return true;
  if (!isObjectNullUndefinedEmpty(concept.internErstattesAv)) return true;
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

export const getInternalConceptRelations = (concept: Concept): Relasjon[] => {
  if (!hasRelatedInternalConcepts(concept)) return [];

  const internalConceptRelations: Relasjon[] = [];

  if (concept.internBegrepsRelasjon) {
    internalConceptRelations.push(
      ...concept.internBegrepsRelasjon.filter((relasjon) => !isObjectNullUndefinedEmpty(relasjon)),
    );
  }

  if (concept.internSeOgså) {
    if (Array.isArray(concept.internSeOgså)) {
      internalConceptRelations.push(
        ...concept.internSeOgså.map((uri): Relasjon => ({ relatertBegrep: uri, relasjon: 'internSeOgså' })),
      );
    } else {
      internalConceptRelations.push({ relatertBegrep: concept.internSeOgså, relasjon: 'internSeOgså' });
    }
  }

  if (concept.internErstattesAv) {
    internalConceptRelations.push(
      ...concept.internErstattesAv.map((uri): Relasjon => ({ relatertBegrep: uri, relasjon: 'internErstattesAv' })),
    );
  }

  return internalConceptRelations;
};

export const getInternalRelatedConcepts = async (concept: Concept, accessToken: string): Promise<Concept[]> => {
  if (!hasRelatedInternalConcepts(concept)) return [];

  const internalRelatedConceptsUris: string[] = [];

  if (concept.internBegrepsRelasjon) {
    internalRelatedConceptsUris.push(
      ...concept.internBegrepsRelasjon
        .map((relasjon) => relasjon.relatertBegrep)
        .filter((value) => value !== null && value !== undefined)
        .filter(Boolean)
        .map((value) => value as string),
    );
  }

  if (concept.internSeOgså) {
    if (Array.isArray(concept.internSeOgså)) {
      internalRelatedConceptsUris.push(...concept.internSeOgså);
    } else {
      internalRelatedConceptsUris.push(concept.internSeOgså);
    }
  }

  if (concept.internErstattesAv) {
    internalRelatedConceptsUris.push(...concept.internErstattesAv);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const internalRelatedConcepts =
    internalRelatedConceptsUris &&
    (await searchInternalConcepts(concept.ansvarligVirksomhet.id, internalRelatedConceptsUris, accessToken)
      .then(async (response) => await (response instanceof Response && response.ok ? response.json() : []))
      .then((body) => extractConcepts(body)));

  return internalRelatedConcepts;
};
