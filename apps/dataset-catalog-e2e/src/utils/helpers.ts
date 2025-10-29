import AxeBuilder from '@axe-core/playwright';
import { Page, Locator, expect } from '@playwright/test';
import * as crypto from 'crypto';

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;
export const writeAuthFile = `${__dirname}/../../.playwright/auth/write.json`;
export const readAuthFile = `${__dirname}/../../.playwright/auth/read.json`;

// Helper to generate a unique, random string
export function uniqueString(prefix = 'dataset') {
  return `${prefix}_${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 10)}_${Date.now()}`;
}

export const generateAccessibilityBuilder = async (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']);

export const getStatusText = (uri: string): string => {
  switch (uri) {
    case 'http://purl.org/adms/status/Completed':
      return 'Ferdigstilt';
    case 'http://purl.org/adms/status/Deprecated':
      return 'Frarådet';
    case 'http://purl.org/adms/status/UnderDevelopment':
      return 'Under utvikling';
    case 'http://purl.org/adms/status/Withdrawn':
      return 'Trukket tilbake';
    default:
      return 'Ukjent';
  }
};

export const getParentLocator = (locator: Locator, n = 1) => {
  let parent = locator;
  for (let i = 0; i < n; i++) {
    parent = parent.locator('..');
  }
  return parent;
};

export const clearCombobox = async (page: any, label: any) => {
  // Workaround to clear and close a combobox.
  const currentValue = await page.getByRole('combobox', { name: label }).inputValue();
  await page.getByRole('combobox', { name: label }).click();

  for (let i = 0; i < currentValue.length; i++) {
    await page.getByLabel(label).press('Backspace');
  }
  await expect(page.getByLabel(label)).toHaveValue('');
  await page.getByLabel(label).press('Tab');
};

export const relationToSourceText = (relationToSource: any) => {
  if (relationToSource === 'egendefinert') {
    return 'Egendefinert';
  } else if (relationToSource === 'basertPaaKilde') {
    return 'Basert på kilde';
  }
  if (relationToSource === 'sitatFraKilde') {
    return 'Sitat fra kilde';
  }
  return null;
};

export const deleteAllDatasets = async (apiRequestContext: any) => {
  console.log('[DELETE ALL DATASETS] Starting deletion of all datasets...');

  try {
    const response = await apiRequestContext.get(`/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets`);
    if (!response.ok()) {
      throw new Error(`API call failed with status ${response.status()}`);
    }

    const datasets = await response.json();
    console.log(datasets);
    console.log(`[DELETE ALL DATASETS] Found ${datasets.length} datasets`);
    for (const dataset of datasets) {
      if (!dataset.erPublisert) {
        console.log(`[DELETE ALL DATASETS] Deleting dataset: ${dataset.id}`);
        await apiRequestContext.delete(`/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets/${dataset.id}`);
      }
    }

    console.log('[DELETE ALL DATASETS] All datasets deleted successfully');
  } catch (error) {
    console.error('[DELETE ALL DATASETS] Error deleting datasets:', error);
    throw error;
  }
};

export const deleteDataset = async (apiRequestContext: any, datasetId: any) => {
  console.log('[DELETE DATASET] Deleting dataset:', datasetId);
  await apiRequestContext.delete(`/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets/${datasetId}`);
  console.log('[DELETE DATASET] Dataset deleted successfully');
};

export const createDataset = async (apiRequestContext: any, dataset: any) => {
  console.log('[CREATE DATASET] Creating dataset:', dataset.title);
  const response = await apiRequestContext.post(`/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets`, {
    data: dataset,
  });

  if (!response.ok()) {
    console.error(`[CREATE DATASET] API call failed with status ${response.status()}`, await response.json());
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const createdDataset = await response.json();
  console.log('[CREATE DATASET] Dataset created successfully with ID:', createdDataset);

  return createdDataset;
};

export const getPublishedDataset = async (apiRequestContext: any) => {
  console.log('[GET PUBLISHED DATASET] Fetching published datasets');
  const response = await apiRequestContext.get(`/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets`);
  if (!response.ok()) {
    console.error('[GET PUBLISHED DATASET] API call failed with status', response.status());
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const datasets = await response.json();
  const publishedDataset = datasets.filter((d: any) => d.erPublisert).pop();
  console.log('[GET PUBLISHED DATASET] Found published dataset:', publishedDataset?.id);
  return publishedDataset;
};

export const publishDataset = async (apiRequestContext: any, datasetId: any) => {
  console.log('[PUBLISH DATASET] Publishing dataset:', datasetId);
  const response = await apiRequestContext.post(
    `/api/catalogs/${process.env.E2E_CATALOG_ID}/datasets/${datasetId}/publish`,
  );

  if (!response.ok()) {
    console.error(`[PUBLISH DATASET] API call failed with status ${response.status()}`, await response.json());
    throw new Error(`API call failed with status ${response.status()}`);
  }

  console.log('[PUBLISH DATASET] Dataset published successfully');
  return await response.json();
};

export const getUsers = async (apiRequestContext: any) => {
  const response = await apiRequestContext.get(`/api/catalogs/${process.env.E2E_CATALOG_ID}/users`);
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const result = await response.json();
  return result;
};
