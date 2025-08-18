import { DataServiceToBeCreated } from '@catalog-frontend/types';
import { uniqueString } from './helpers';

export const getRandomDataService = () => {
  // Create a random data service
  const dataService: DataServiceToBeCreated = {
    title: {
      nb: uniqueString('test_dataservice_nb'),
      nn: uniqueString('test_dataservice_nn'),
      en: uniqueString('test_dataservice_en'),
    },
    description: {
      nb: uniqueString('test_dataservice_description_nb'),
      nn: uniqueString('test_dataservice_description_nn'),
      en: uniqueString('test_dataservice_description_en'),
    },
    endpointUrl: 'https://api.example.com/data',
    keywords: {
      nb: ['test', 'data', 'service'],
      nn: ['test', 'data', 'tjeneste'],
      en: ['test', 'data', 'service'],
    },
    contactPoint: {
      name: {
        nb: 'Test Contact',
        nn: 'Test Kontakt',
        en: 'Test Contact',
      },
      email: 'test@example.com',
      phone: '+4712345678',
      url: 'https://example.com/contact',
    },
  };
  return dataService;
};

export const getMinimalDataService = () => {
  // Create a minimal data service with required fields only
  const dataService: DataServiceToBeCreated = {
    title: {
      nb: uniqueString('minimal_dataservice_nb'),
      nn: uniqueString('minimal_dataservice_nn'),
      en: uniqueString('minimal_dataservice_en'),
    },
    description: {
      nb: uniqueString('minimal_dataservice_description_nb'),
      nn: uniqueString('minimal_dataservice_description_nn'),
      en: uniqueString('minimal_dataservice_description_en'),
    },
    endpointUrl: 'https://api.example.com/minimal',
    keywords: {
      nb: ['minimal'],
      nn: ['minimal'],
      en: ['minimal'],
    },
  };
  return dataService;
};
