import { Dataset, DatasetToBeCreated, Distribution, PublicationStatus } from '@catalog-frontend/types';
import { groupByKeys } from '@catalog-frontend/utils';
import { isEmpty } from 'lodash';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset?.id ?? '',
    catalogId: dataset?.catalogId ?? '',
    _lastModified: dataset?._lastModified,
    uri: dataset?.uri,
    originalUri: dataset?.originalUri,
    title: dataset.title ?? '',
    description: !isEmpty(dataset?.description) ? dataset.description : {},
    accessRights: { uri: dataset?.accessRights?.uri ?? undefined },
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [],
    registrationStatus: dataset.registrationStatus,
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== undefined)
        ? dataset.landingPage
        : [],
    euDataTheme: dataset.euDataTheme ?? [],
    losTheme: dataset.losTheme ?? [],
    type: dataset?.type,
    keywordList: dataset.keywordList ? dataset.keywordList : dataset.keyword ? groupByKeys(dataset?.keyword) : {},
    conceptList: dataset.conceptList ? dataset.conceptList : dataset.concepts ? dataset.concepts.map((concept) => concept.uri) : [],
    provenance: dataset?.provenance?.uri ? { uri: dataset?.provenance?.uri } : undefined,
    accrualPeriodicity: dataset?.accrualPeriodicity?.uri ? { uri: dataset?.accrualPeriodicity?.uri } : undefined,
    modified: dataset?.modified,
    hasCurrentnessAnnotation: { hasBody: dataset.hasCurrentnessAnnotation?.hasBody },
    conformsTo: dataset?.conformsTo,
    hasRelevanceAnnotation: { hasBody: dataset?.hasRelevanceAnnotation?.hasBody },
    hasCompletenessAnnotation: { hasBody: dataset.hasCompletenessAnnotation?.hasBody },
    hasAccuracyAnnotation: { hasBody: dataset?.hasAccuracyAnnotation?.hasBody },
    hasAvailabilityAnnotation: { hasBody: dataset.hasAvailabilityAnnotation?.hasBody },
    spatialList: dataset.spatial ? dataset.spatial.map((spatial) => spatial.uri) : [],
    temporal: dataset.temporal ?? [],
    issued: dataset.issued ?? '',
    languageList: dataset.language ? dataset.language.map((lang) => lang.uri) : [],
    informationModelsFromFDK: dataset.informationModelsFromFDK ?? [],
    informationModel: dataset?.informationModel,
    qualifiedAttributions: dataset?.qualifiedAttributions,
    sample: dataset?.sample,
    references: dataset?.references,
    relations: dataset?.relations,
    distribution: dataset?.distribution ?? [],
    contactPoint: dataset.contactPoint ?? [],
  };
};

export const datasetToBeCreatedTemplate = (catalogId: string): DatasetToBeCreated => {
  return {
    catalogId,
    title: {},
    description: {},
    registrationStatus: PublicationStatus.DRAFT,
    landingPage: [],
    accessRights: { uri: undefined },
    legalBasisForAccess: [],
    legalBasisForProcessing: [],
    legalBasisForRestriction: [],
    euDataTheme: [],
    losTheme: [],
    type: undefined,
    keywordList: {},
    conceptList: [],
    provenance: undefined,
    accrualPeriodicity: undefined,
    modified: undefined,
    hasCurrentnessAnnotation: undefined,
    conformsTo: undefined,
    hasRelevanceAnnotation: undefined,
    hasCompletenessAnnotation: undefined,
    hasAccuracyAnnotation: undefined,
    hasAvailabilityAnnotation: undefined,
    spatialList: [],
    temporal: [],
    issued: '',
    languageList: [],
    informationModelsFromFDK: [],
    informationModel: undefined,
    qualifiedAttributions: undefined,
    sample: undefined,
    references: undefined,
    relations: undefined,
    distribution: undefined,
    contactPoint: [],
  };
};

export const distributionTemplate = (dist: Distribution | undefined) => {
  return (dist
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
        accessServiceUris: [],
      }) as Distribution;
};
