import { AccessRights, Dataset, DatasetToBeCreated, Distribution, PublicationStatus } from '@catalog-frontend/types';
import { groupByKeys } from '@catalog-frontend/utils';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset?.id ?? '',
    catalogId: dataset?.catalogId ?? '',
    _lastModified: dataset?._lastModified,
    title: dataset.title ?? '',
    description: dataset.description ?? '',
    accessRights: { uri: dataset?.accessRights?.uri ?? AccessRights.PUBLIC },
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
    keywordList: dataset.keyword ? groupByKeys(dataset?.keyword) : { nb: [] },
    conceptList: dataset.concepts ? dataset.concepts.map((concept) => concept.uri) : [],
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
    temporal: dataset.temporal ?? [{ startDate: '', endDate: '' }],
    issued: dataset.issued ?? '',
    languageList: dataset.language ? dataset.language.map((lang) => lang.uri) : [],
    informationModelsFromFDK: dataset.informationModelsFromFDK ?? [],
    informationModel: dataset?.informationModel,
    qualifiedAttributions: dataset?.qualifiedAttributions,
    sample: dataset?.sample,
    references: dataset?.references,
    relations: dataset?.relations,
    inSeries: dataset.inSeries ?? '',
    distribution: dataset?.distribution ?? [],
    contactPoint: dataset.contactPoint ?? [],
  };
};

export const datasetToBeCreatedTemplate = (): DatasetToBeCreated => {
  return {
    title: {
      nb: '',
      nn: '',
      en: '',
    },
    description: {
      nb: '',
      nn: '',
      en: '',
    },
    registrationStatus: PublicationStatus.DRAFT,
    landingPage: [],
    accessRights: { uri: '' },
    legalBasisForAccess: [],
    legalBasisForProcessing: [],
    legalBasisForRestriction: [],
    euDataTheme: [],
    losTheme: [],
    type: undefined,
    keywordList: { nb: [] },
    keyword: [{ nb: '' }],
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
    temporal: [{ startDate: '', endDate: '' }],
    issued: '',
    languageList: [],
    informationModelsFromFDK: [],
    informationModel: undefined,
    qualifiedAttributions: undefined,
    sample: undefined,
    references: undefined,
    relations: undefined,
    inSeries: '',
    distribution: undefined,
    contactPoint: [
      {
        email: '',
        hasTelephone: '',
        hasURL: '',
        organizationUnit: '',
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
      }
    : {
        title: { nb: '' },
        description: { nb: '' },
        downloadURL: [''],
        accessURL: [],
        format: [],
        mediaType: [],
        licenseList: [],
        conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
        pageList: [],
        accessServiceUris: [],
      };
};
