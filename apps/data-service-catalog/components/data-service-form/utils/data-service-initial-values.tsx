import { DataServiceToBeCreated } from '@catalog-frontend/types';

export const dataServiceToBeCreatedTemplate = (): DataServiceToBeCreated => {
  return {
    title: {},
    description: {},
    modified: '',
    status: '',
    endpointUrl: '',
    endpointDescriptions: [],
    accessRights: '',
    formats: [],
    keywords: {},
    landingPage: '',
    pages: [],
    license: '',
    servesDataset: [],
    contactPoint: {},
    availability: '',
    costs: [],
  };
};
