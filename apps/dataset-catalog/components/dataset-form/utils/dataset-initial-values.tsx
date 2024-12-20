import { AccessRights, Dataset, DatasetToBeCreated, Distribution, PublicationStatus } from '@catalog-frontend/types';
import { groupByKeys } from '@catalog-frontend/utils';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset?.id ?? '',
    catalogId: dataset?.catalogId ?? '',
    _lastModified: dataset?._lastModified,
    title: {
      nb: (dataset && dataset.title?.nb) ?? '',
    },
    description: {
      nb: (dataset && dataset.description?.nb) ?? '',
    },
    accessRights: { uri: dataset?.accessRights?.uri ?? AccessRights.PUBLIC },
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [],
    registrationStatus: dataset.registrationStatus,
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== null)
        ? dataset.landingPage
        : [],
    losThemeList: dataset.theme ? dataset.theme.filter((t) => t.uri && t.uri.includes('/los/')).map((t) => t.uri) : [],
    euThemeList: dataset.theme
      ? dataset.theme.filter((t) => t.uri && t.uri.includes('/data-theme/')).map((t) => t.uri)
      : [],
    type: dataset?.type,
    keywordList: dataset.keyword ? groupByKeys(dataset.keyword) : { nb: [] },
    conceptList: dataset.concepts ? dataset.concepts.map((concept) => concept.uri) : [],
    provenance: dataset?.provenance?.uri ? { uri: dataset?.provenance?.uri } : undefined,
    accrualPeriodicity: dataset?.accrualPeriodicity?.uri ? { uri: dataset?.accrualPeriodicity?.uri } : undefined,
    modified: dataset?.modified,
    hasCurrentnessAnnotation: { hasBody: dataset.hasCurrentnessAnnotation?.hasBody },
    conformsTo: dataset?.conformsTo ?? [{ prefLabel: { nb: '' }, uri: '' }],
    hasRelevanceAnnotation: { hasBody: dataset?.hasRelevanceAnnotation?.hasBody },
    hasCompletenessAnnotation: { hasBody: dataset.hasCompletenessAnnotation?.hasBody },
    hasAccuracyAnnotation: { hasBody: dataset?.hasAccuracyAnnotation?.hasBody },
    hasAvailabilityAnnotation: { hasBody: dataset.hasAvailabilityAnnotation?.hasBody },
    spatialList: dataset.spatial ? dataset.spatial.map((spatial) => spatial.uri) : [],
    temporal: dataset.temporal ?? [{ startDate: '', endDate: '' }],
    issued: dataset.issued ?? '',
    languageList: dataset.language ? dataset.language.map((lang) => lang.uri) : [],
    informationModelsFromFDK: dataset.informationModelsFromFDK ?? [],
    informationModel: dataset.informationModel ?? [{ prefLabel: { nb: '' }, uri: '' }],
    qualifiedAttributions: dataset?.qualifiedAttributions,
    sample: dataset.sample ?? [
      {
        description: {
          nb: '',
        },
        downloadURL: [],
        accessURL: [],
        format: [],
        mediaType: [],
      },
    ],
    references: dataset?.references,
    relations: dataset.relations ?? [{ uri: '', prefLabel: { nb: '' } }],
    inSeries: dataset.inSeries ?? '',
    distribution: dataset.distribution?.map((dist) => ({
      ...dist,
      accessServiceList: dist.accessService?.map((service) => service.uri) || [],
    })),
    contactPoint: dataset.contactPoint ?? {},
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
    losThemeList: [],
    euThemeList: [],
    type: undefined,
    keywordList: { nb: [] },
    conceptList: [],
    provenance: undefined,
    accrualPeriodicity: undefined,
    modified: undefined,
    hasCurrentnessAnnotation: undefined,
    conformsTo: [{ prefLabel: { nb: '' }, uri: '' }],
    hasRelevanceAnnotation: undefined,
    hasCompletenessAnnotation: undefined,
    hasAccuracyAnnotation: undefined,
    hasAvailabilityAnnotation: undefined,
    spatialList: [],
    temporal: [{ startDate: '', endDate: '' }],
    issued: '',
    languageList: [],
    informationModelsFromFDK: [],
    informationModel: [{ prefLabel: { nb: '' }, uri: '' }],
    qualifiedAttributions: undefined,
    sample: [
      {
        description: {
          nb: '',
        },
        downloadURL: [],
        accessURL: [],
        format: [],
        mediaType: [],
      },
    ],
    references: undefined,
    relations: [{ uri: '', prefLabel: { nb: '' } }],
    inSeries: '',
    distribution: [],
    contactPoint: [],
  };
};

export const distributionTemplate = (dist: Distribution | undefined) => {
  return dist
    ? {
        ...dist,
        accessServiceList: dist.accessService?.map((service) => service.uri) || [],
      }
    : {
        title: { nb: '' },
        description: { nb: '' },
        downloadURL: [],
        accessURL: [],
        format: [],
        mediaType: [],
        licenseList: [],
        conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
        pageList: [],
        accessServiceList: [],
      };
};
