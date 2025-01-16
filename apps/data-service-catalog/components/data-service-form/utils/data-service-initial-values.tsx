import { DataServiceToBeCreated } from '@catalog-frontend/types';

export const dataServiceToBeCreatedTemplate = (): DataServiceToBeCreated => {
  return {
    title: {
      nb: '',
    },
    description: {
      nb: '',
    },
    modified: '',
    status: '',
    endpointUrl: '',
    endpointDescriptions: [],
    contactPoint: undefined,
  };
};
