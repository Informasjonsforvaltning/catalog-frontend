import { Dataset, DatasetToBeCreated, Distribution } from '@catalog-frontend/types';
import _ from 'lodash';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset.id,
    catalogId: dataset.catalogId,
    lastModified: dataset.lastModified,
    title: dataset?.title,
    description: dataset?.description,
    accessRight: dataset?.accessRight,
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [],
    published: dataset.published,
    approved: dataset.approved,
    landingPage: dataset?.landingPage ?? [],
    euDataTheme: dataset?.euDataTheme ?? [],
    losTheme: dataset?.losTheme ?? [],
    type: dataset?.type,
    keywords: dataset?.keywords,
    concepts: dataset?.concepts,
    provenance: dataset?.provenance,
    frequency: dataset?.frequency,
    modified: dataset?.modified,
    currentness: dataset?.currentness,
    conformsTo: dataset?.conformsTo,
    relevance: dataset?.relevance,
    completeness: dataset?.completeness,
    accuracy: dataset?.accuracy,
    availability: dataset?.availability,
    spatial: dataset?.spatial,
    temporal: dataset.temporal ?? [{ startDate: '', endDate: '' }],
    issued: dataset.issued ?? '',
    language: dataset?.language,
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
    title: {
      nb: '',
    },
    description: {
      nb: '',
    },
    landingPage: [],
    legalBasisForAccess: [],
    legalBasisForProcessing: [],
    legalBasisForRestriction: [],
    euDataTheme: [],
    losTheme: [],
    type: undefined,
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
    temporal: [{ startDate: '', endDate: '' }],
    issued: '',
    language: [],
    informationModelsFromFDK: [],
    informationModelsFromOtherSources: undefined,
    qualifiedAttributions: undefined,
    sample: undefined,
    references: undefined,
    relatedResources: undefined,
    distribution: undefined,
    contactPoints: [
      {
        email: '',
        phone: '',
        url: '',
      },
    ],
  };
};

export const distributionTemplate = (dist: Distribution | undefined) => {
  return dist
    ? {
        ...dist,
        title: dist?.title ?? { nb: '' },
        downloadURL: dist?.downloadURL && dist?.downloadURL[0] ? dist?.downloadURL : [''],
        conformsTo: !_.isEmpty(dist.conformsTo) ? dist.conformsTo : [{ uri: '', prefLabel: { nb: '' } }],
      }
    : {
        title: { nb: '' },
        description: { nb: '' },
        downloadURL: [''],
        accessURL: [],
        format: [],
        mediaType: [],
        license: '',
        conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
        page: [],
        accessServices: [],
      };
};
