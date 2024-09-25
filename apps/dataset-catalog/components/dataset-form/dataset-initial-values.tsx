import { AccessRights, Dataset, DatasetToBeCreated, PublicationStatus } from '@catalog-frontend/types';

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
    registrationStatus: dataset.registrationStatus,
    landingPage:
      dataset.landingPage && dataset?.landingPage?.length > 0 && dataset.landingPage.every((page) => page !== null)
        ? dataset.landingPage
        : [''],
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
    accessRights: { uri: '', prefLabel: { nb: '' } },
    registrationStatus: PublicationStatus.DRAFT,
    landingPage: [''],
  };
};
