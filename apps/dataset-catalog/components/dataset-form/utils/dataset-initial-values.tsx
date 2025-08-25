import { Dataset, DatasetToBeCreated, Distribution } from '@catalog-frontend/types';
import { isEmpty } from 'lodash';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset?.id ?? '',
    catalogId: dataset?.catalogId ?? '',
    approved: dataset?.approved ?? false,
    published: dataset?.published ?? false,
    lastModified: dataset?.lastModified,
    uri: dataset?.uri,
    originalUri: dataset?.originalUri,
    title: dataset.title ?? '',
    description: !isEmpty(dataset?.description) ? dataset.description : {},
    accessRight: dataset?.accessRight,
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [],
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== undefined)
        ? dataset.landingPage
        : [],
    euDataTheme: dataset.euDataTheme ?? [],
    losTheme: dataset.losTheme ?? [],
    type: dataset?.type,
    keywords: dataset.keywords,
    concepts: dataset.concepts,
    provenance: dataset?.provenance,
    frequency: dataset?.frequency,
    modified: dataset?.modified,
    currentness: { hasBody: dataset.currentness?.hasBody },
    conformsTo: dataset?.conformsTo,
    relevance: { hasBody: dataset?.relevance?.hasBody },
    completeness: { hasBody: dataset.completeness?.hasBody },
    accuracy: { hasBody: dataset?.accuracy?.hasBody },
    availability: { hasBody: dataset.availability?.hasBody },
    spatial: dataset.spatial,
    temporal: dataset.temporal ?? [],
    issued: dataset.issued ?? '',
    language: dataset.language,
    informationModelsFromFDK: dataset.informationModelsFromFDK ?? [],
    informationModelsFromOtherSources: dataset?.informationModelsFromOtherSources,
    qualifiedAttributions: dataset?.qualifiedAttributions,
    sample: dataset?.sample,
    references: dataset?.references,
    relatedResources: dataset?.relatedResources,
    distribution: dataset?.distribution ?? [],
    contactPoints: dataset.contactPoints ?? [],
  };
};

export const datasetToBeCreatedTemplate = (): DatasetToBeCreated => {
  return {
    title: {},
    description: {},
    approved: false,
    landingPage: [],
    accessRight: undefined,
    legalBasisForAccess: [],
    legalBasisForProcessing: [],
    legalBasisForRestriction: [],
    euDataTheme: [],
    losTheme: [],
    type: undefined,
    keywords: {},
    concepts: [],
    provenance: undefined,
    frequency: undefined,
    modified: undefined,
    currentness: undefined,
    conformsTo: undefined,
    relevance: undefined,
    completeness: undefined,
    accuracy: undefined,
    availability: undefined,
    spatial: [],
    temporal: [],
    issued: '',
    language: [],
    informationModelsFromFDK: [],
    informationModelsFromOtherSources: undefined,
    qualifiedAttributions: undefined,
    sample: undefined,
    references: undefined,
    relatedResources: undefined,
    distribution: undefined,
    contactPoints: [],
  };
};

export const distributionTemplate = (dist: Distribution | undefined) => {
  return (
    dist
      ? {
          ...dist,
          title: dist?.title ?? {},
          downloadURL: dist?.downloadURL && dist?.downloadURL[0] ? dist?.downloadURL : [],
          conformsTo: !isEmpty(dist.conformsTo) ? dist.conformsTo : [],
        }
      : {
          title: {},
          description: {},
          downloadURL: [],
          accessURL: [],
          format: [],
          mediaType: [],
          license: {},
          conformsTo: [],
          page: [],
          accessServices: [],
        }
  ) as Distribution;
};
