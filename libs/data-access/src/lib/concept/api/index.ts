import { Concept, UnionRelation, SearchConceptQuery, Search, RelatedConcept, UnionRelationTypeEnum } from '@catalog-frontend/types';
import { searchConceptsByUri } from '../../search/api';
import { getUniqueConceptIdsFromUris, isObjectNullUndefinedEmpty } from '@catalog-frontend/utils';
import { Operation } from 'fast-json-patch';

type SearchObject = Search.SearchObject;

export const conceptCatalogApiCall = async (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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

export const patchConcept = (conceptId: string, patchOperations: Operation[], accessToken: string) =>
  conceptCatalogApiCall('PATCH', `/begreper/${conceptId}`, patchOperations, accessToken);

export const importConcepts = (concepts: Omit<Concept, 'id'>[], accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper/import`, concepts, accessToken);

export const deleteConcept = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('DELETE', `/begreper/${conceptId}`, null, accessToken);

export const publishConcept = (conceptId: string, accessToken: string) =>
  conceptCatalogApiCall('POST', `/begreper/${conceptId}/publish`, null, accessToken);

export const extractHits = (searchResponse: any) => searchResponse?.hits ?? [];

export const searchInternalConcepts = (
  catalogId: string,
  body: string[],
  accessToken: string | null | undefined,
): Promise<Response> =>
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
    accessToken ?? '',
  );

const hasRelatedConcepts = (concept: Concept): boolean => {
  if (!isObjectNullUndefinedEmpty(concept.begrepsRelation)) return true;
  if (!isObjectNullUndefinedEmpty(concept.seOgså)) return true;
  if (!isObjectNullUndefinedEmpty(concept.erstattesAv)) return true;
  return false;
};

const hasRelatedInternalConcepts = (concept: Concept): boolean => {
  if (!isObjectNullUndefinedEmpty(concept.internBegrepsRelation)) return true;
  if (!isObjectNullUndefinedEmpty(concept.internSeOgså)) return true;
  if (!isObjectNullUndefinedEmpty(concept.internErstattesAv)) return true;
  return false;
};

export const getPublishedConceptRelations = (concept: Concept): UnionRelation[] => {
  if (!hasRelatedConcepts(concept)) return [];

  const conceptRelations: UnionRelation[] = [];

  if (concept.begrepsRelation) {
    conceptRelations.push(...concept.begrepsRelation.filter((relasjon) => !isObjectNullUndefinedEmpty(relasjon)));
  }

  if (concept.seOgså) {
    if (Array.isArray(concept.seOgså)) {
      conceptRelations.push(
        ...concept.seOgså.map((uri): UnionRelation => ({ relatertBegrep: uri, relasjon: UnionRelationTypeEnum.SE_OGSÅ })),
      );
    } else {
      conceptRelations.push({ relatertBegrep: concept.seOgså, relasjon: UnionRelationTypeEnum.SE_OGSÅ });
    }
  }

  if (concept.erstattesAv) {
    conceptRelations.push(
      ...concept.erstattesAv.map((uri): UnionRelation => ({ relatertBegrep: uri, relasjon: UnionRelationTypeEnum.ERSTATTES_AV })),
    );
  }

  return conceptRelations;
};

export const getPublishedRelatedConcepts = async (
  concept: Concept,
  accessToken: string | null | undefined,
): Promise<RelatedConcept[]> => {
  if (!hasRelatedConcepts(concept)) return [];

  const relatedConceptsUris = [];

  if (concept.begrepsRelation)
    relatedConceptsUris.push(
      ...concept.begrepsRelation
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

  const filteredUris = relatedConceptsUris.filter((uri): uri is string => uri !== undefined && uri !== null);

  const internalUris: string[] = [];
  const externalUris: string[] = [];

  filteredUris.forEach((uri: string) => {
    if (uri.includes('concept-catalog') && uri.includes(concept.ansvarligVirksomhet.id)) {
      internalUris.push(uri);
    } else {
      externalUris.push(uri);
    }
  });

  const relatedExternalConcepts = await fetchExternaRelatedlConcepts(externalUris);
  const relatedInternalConcepts = await fetchInternalRelatedConcepts(
    concept.ansvarligVirksomhet.id,
    getUniqueConceptIdsFromUris(internalUris),
    accessToken,
  );

  return [...relatedInternalConcepts, ...relatedExternalConcepts];
};

const fetchExternaRelatedlConcepts = async (uris: string[]): Promise<RelatedConcept[]> => {
  if (uris.length === 0) return [];

  try {
    const response = await searchConceptsByUri(uris);
    if (!response.ok) throw new Error(`Failed to fetch related concepts: ${response.statusText}`);

    const body = await response.json();
    const relatedExternalConcepts: SearchObject[] = extractHits(body);
    return relatedExternalConcepts.map(({ id, uri, title, description }) => ({
      id,
      title,
      description,
      identifier: uri,
      externalHref: true,
      href: `${process.env.FDK_BASE_URI}/concepts/${id}`,
    })) as RelatedConcept[];
  } catch (error) {
    console.error('Failed to fetch related concepts', error);
    return [];
  }
};

const fetchInternalRelatedConcepts = async (
  catalogId: string,
  internalConceptIds: string[],
  accessToken: string | null | undefined,
): Promise<RelatedConcept[]> => {
  if (internalConceptIds.length === 0) return [];

  try {
    const response = await searchInternalConcepts(catalogId, internalConceptIds, accessToken);
    if (!response.ok) throw new Error(`Failed to fetch internal concepts: ${response.statusText}`);

    const body = await response.json();
    const relatedInternalConcepts: Concept[] = extractHits(body);
    return relatedInternalConcepts.map(({ id, anbefaltTerm, definisjon, originaltBegrep }) => ({
      id,
      title: anbefaltTerm?.navn,
      description: definisjon?.tekst,
      identifier: originaltBegrep,
      externalHref: false,
      href: `/${catalogId}/${id}`,
    })) as RelatedConcept[];
  } catch (error) {
    console.error('Failed to fetch internal concepts', error);
    return [];
  }
};

export const getUnpublishedConceptRelations = (concept: Concept): UnionRelation[] => {
  if (!hasRelatedInternalConcepts(concept)) return [];

  const internalConceptRelations: UnionRelation[] = [];

  if (concept.internBegrepsRelation) {
    internalConceptRelations.push(
      ...concept.internBegrepsRelation.filter((relasjon) => !isObjectNullUndefinedEmpty(relasjon)),
    );
  }

  if (concept.internSeOgså) {
    if (Array.isArray(concept.internSeOgså)) {
      internalConceptRelations.push(
        ...concept.internSeOgså.map((uri): UnionRelation => ({ relatertBegrep: uri, relasjon: UnionRelationTypeEnum.SE_OGSÅ, internal: true })),
      );
    } else {
      internalConceptRelations.push({ relatertBegrep: concept.internSeOgså, relasjon: UnionRelationTypeEnum.SE_OGSÅ, internal: true });
    }
  }

  if (concept.internErstattesAv) {
    internalConceptRelations.push(
      ...concept.internErstattesAv.map(
        (uri): UnionRelation => ({ relatertBegrep: uri, relasjon: UnionRelationTypeEnum.ERSTATTES_AV, internal: true }),
      ),
    );
  }

  return internalConceptRelations;
};

export const getUnpublishedRelatedConcepts = async (
  concept: Concept,
  accessToken: string | null | undefined,
): Promise<RelatedConcept[]> => {
  if (!hasRelatedInternalConcepts(concept)) return [];

  const unpublishedRelatedConceptsIds: string[] = [];

  if (concept.internBegrepsRelation) {
    unpublishedRelatedConceptsIds.push(
      ...concept.internBegrepsRelation
        .map((relasjon) => relasjon.relatertBegrep)
        .filter((value) => value !== null && value !== undefined)
        .filter(Boolean)
        .map((value) => value as string),
    );
  }

  if (concept.internSeOgså) {
    if (Array.isArray(concept.internSeOgså)) {
      unpublishedRelatedConceptsIds.push(...concept.internSeOgså);
    } else {
      unpublishedRelatedConceptsIds.push(concept.internSeOgså);
    }
  }

  if (concept.internErstattesAv) {
    unpublishedRelatedConceptsIds.push(...concept.internErstattesAv);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const internalRelatedConcepts = fetchInternalRelatedConcepts(
    concept.ansvarligVirksomhet.id,
    unpublishedRelatedConceptsIds,
    accessToken,
  );
  return internalRelatedConcepts;
};

export const getAllConceptCatalogs = (accessToken: string) =>
  conceptCatalogApiCall('GET', `/begrepssamlinger`, null, accessToken);
