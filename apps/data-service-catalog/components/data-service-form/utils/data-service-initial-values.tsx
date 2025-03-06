import { DataServiceToBeCreated } from '@catalog-frontend/types';

export const dataServiceToBeCreatedTemplate = (): DataServiceToBeCreated => {
  return {
    title: {},
    description: {},
    modified: '',
    status: '',
    endpointUrl: '',
    endpointDescriptions: [],
    accessRights: 'none',
    formats: [],
    keywords: {},
    landingPage: '',
    pages: [],
    license: 'none',
    servesDataset: [],
    contactPoint: {},
    availability: '',
    costs: [],
  };
};
