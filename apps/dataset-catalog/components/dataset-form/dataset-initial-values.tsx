import { AccessRights, Dataset, DatasetToBeCreated, PublicationStatus } from '@catalog-frontend/types';
import { groupByKeys } from '@catalog-frontend/utils';

export const datasetTemplate = (dataset: Dataset): Dataset => {
  return {
    id: dataset?.id ?? '',
    catalogId: dataset?.catalogId ?? '',
    _lastModified: dataset?._lastModified,
    title: {
      nb: (dataset && dataset.title?.nb) ?? '',
      nn: (dataset && dataset.title?.nn) ?? '',
      en: (dataset && dataset.title?.en) ?? '',
    },
    description: {
      nb: (dataset && dataset.description?.nb) ?? '',
      nn: (dataset && dataset.description?.nn) ?? '',
      en: (dataset && dataset.description?.en) ?? '',
    },
    accessRights: { uri: dataset?.accessRights?.uri ?? AccessRights.PUBLIC },
    legalBasisForAccess: dataset?.legalBasisForAccess ?? [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForProcessing: dataset?.legalBasisForProcessing ?? [{ uri: '', prefLabel: { nb: '' } }],
    legalBasisForRestriction: dataset?.legalBasisForRestriction ?? [{ uri: '', prefLabel: { nb: '' } }],
    registrationStatus: dataset.registrationStatus,
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== null)
        ? dataset.landingPage
        : [''],
    losThemeList: dataset.theme ? dataset.theme.filter((t) => t.uri.includes('/los/')).map((t) => t.uri) : [],
    euThemeList: dataset.theme ? dataset.theme.filter((t) => t.uri.includes('/data-theme/')).map((t) => t.uri) : [],
    type: dataset.type ?? '',
    keywordList: dataset.keyword ? groupByKeys(dataset.keyword) : { nb: [] },
    conceptList: dataset.concepts ? dataset.concepts.map((concept) => concept.uri) : [],
    provenance: { uri: dataset?.provenance?.uri ?? '' },
    accrualPeriodicity: { uri: dataset?.accrualPeriodicity?.uri ?? '' },
    modified: dataset.modified ?? '',
    hasCurrentnessAnnotation: { hasBody: { nb: dataset.hasCurrentnessAnnotation?.hasBody?.nb ?? '' } },
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
    landingPage: [''],
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
  };
};
