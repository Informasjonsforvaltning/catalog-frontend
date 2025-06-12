import { BrowserContext } from '@playwright/test';
import { uniqueString } from './helpers';

export async function createRandomDataset(context: BrowserContext) {
  const dataset = {
    id: uniqueString('dataset'),
    title: {
      nb: uniqueString('title_nb'),
      nn: uniqueString('title_nn'),
      en: uniqueString('title_en'),
    },
    description: {
      nb: uniqueString('description_nb'),
      nn: uniqueString('description_nn'),
      en: uniqueString('description_en'),
    },
    accessRights: {
      uri: 'http://publications.europa.eu/resource/authority/access-right/PUBLIC',
      label: {
        nb: 'Allmenn tilgang',
        nn: 'Allmenn tilgang',
        en: 'Public access',
      },
    },
    legalBasisForRestriction: [],
    legalBasisForProcessing: [],
    legalBasisForAccess: [],
    issued: '2024-03-20',
    euDataTheme: [],
    losTheme: [],
    distribution: [],
    landingPage: [],
    type: '',
    provenance: '',
    frequency: '',
    reference: [],
    concept: [],
    informationModel: [],
    contactPoint: [],
  };

  // Create the dataset using the API
  const response = await context.request.post('/api/catalogs/313422127/datasets', {
    data: dataset,
  });

  if (!response.ok()) {
    throw new Error(`Failed to create dataset: ${response.statusText()}`);
  }

  return dataset;
} 