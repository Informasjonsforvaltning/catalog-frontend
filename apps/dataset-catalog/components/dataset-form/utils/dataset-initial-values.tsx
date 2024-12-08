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
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [{ uri: '', prefLabel: { nb: '' } }],
    registrationStatus: dataset.registrationStatus,
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== null)
        ? dataset.landingPage
        : [],
    losThemeList: dataset.theme ? dataset.theme.filter((t) => t.uri && t.uri.includes('/los/')).map((t) => t.uri) : [],
    euThemeList: dataset.theme
      ? dataset.theme.filter((t) => t.uri && t.uri.includes('/data-theme/')).map((t) => t.uri)
      : [],
    type: dataset.type ?? '',
    keywordList: dataset.keyword ? groupByKeys(dataset.keyword) : { nb: [] },
    conceptList: dataset.concepts ? dataset.concepts.map((concept) => concept.uri) : [],
    provenance: { uri: dataset?.provenance?.uri ?? '' },
    accrualPeriodicity: { uri: dataset?.accrualPeriodicity?.uri ?? '' },
    modified: dataset.modified ?? '',
    hasCurrentnessAnnotation: { hasBody: { nb: dataset.hasCurrentnessAnnotation?.hasBody?.nb ?? '' } },
    conformsTo: dataset?.conformsTo ?? [{ prefLabel: { nb: '' }, uri: '' }],
    hasRelevanceAnnotation: { hasBody: { nb: dataset.hasRelevanceAnnotation?.hasBody?.nb ?? '' } },
    hasCompletenessAnnotation: { hasBody: { nb: dataset.hasCompletenessAnnotation?.hasBody?.nb ?? '' } },
    hasAccuracyAnnotation: { hasBody: { nb: dataset.hasAccuracyAnnotation?.hasBody?.nb ?? '' } },
    hasAvailabilityAnnotation: { hasBody: { nb: dataset.hasAvailabilityAnnotation?.hasBody?.nb ?? '' } },
    spatialList: dataset.spatial ? dataset.spatial.map((spatial) => spatial.uri) : [],
    temporal: dataset.temporal ?? [{ startDate: '', endDate: '' }],
    issued: dataset.issued ?? '',
    languageList: dataset.language ? dataset.language.map((lang) => lang.uri) : [],
    informationModelsFromFDK: dataset.informationModelsFromFDK ?? [],
    informationModel: dataset.informationModel ?? [{ prefLabel: { nb: '' }, uri: '' }],
    qualifiedAttributions: dataset.qualifiedAttributions ?? [],
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
    references: dataset.references ?? [{ source: { uri: '' }, referenceType: { code: '' } }],
    relations: dataset.relations ?? [{ uri: '', prefLabel: { nb: '' } }],
    inSeries: dataset.inSeries ?? '',
    distribution: dataset.distribution?.map((dist) => ({
      ...dist,
      accessServiceList: dist.accessService?.map((service) => service.uri) || [],
    })),
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
    legalBasisForAccess: [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForProcessing: [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForRestriction: [{ uri: '', prefLabel: { nb: '' } }],
    losThemeList: [],
    euThemeList: [],
    type: '',
    keywordList: { nb: [] },
    conceptList: [],
    provenance: { uri: '' },
    accrualPeriodicity: { uri: '' },
    modified: '',
    hasCurrentnessAnnotation: { hasBody: { nb: '' } },
    conformsTo: [{ prefLabel: { nb: '' }, uri: '' }],
    hasRelevanceAnnotation: { hasBody: { nb: '' } },
    hasCompletenessAnnotation: { hasBody: { nb: '' } },
    hasAccuracyAnnotation: { hasBody: { nb: '' } },
    hasAvailabilityAnnotation: { hasBody: { nb: '' } },
    spatialList: [],
    temporal: [{ startDate: '', endDate: '' }],
    issued: '',
    languageList: [],
    informationModelsFromFDK: [],
    informationModel: [{ prefLabel: { nb: '' }, uri: '' }],
    qualifiedAttributions: [],
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
    references: [{ source: { uri: '' }, referenceType: { code: '' } }],
    relations: [{ uri: '', prefLabel: { nb: '' } }],
    inSeries: '',
    distribution: [],
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
