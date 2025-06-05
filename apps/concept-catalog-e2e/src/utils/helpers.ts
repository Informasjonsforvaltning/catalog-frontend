import AxeBuilder from '@axe-core/playwright';
import { Locator, Page, expect } from '@playwright/test';

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;
export const writeAuthFile = `${__dirname}/../../.playwright/auth/write.json`;
export const readAuthFile = `${__dirname}/../../.playwright/auth/read.json`;

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

export const clearCombobox = async (page, label) => {
  // Workaround to clear and close a combobox.
  const currentValue = await page.getByRole('combobox', { name: label }).inputValue();
  await page.getByRole('combobox', { name: label }).click();
 
  for (let i = 0; i < currentValue.length; i++) {
    await page.getByLabel(label).press('Backspace');
  }  
  await expect(page.getByLabel(label)).toHaveValue('');
  await page.getByLabel(label).press('Tab');
};

export const relationToSourceText = (relationToSource) => {
  if (relationToSource === 'egendefinert') {
    return 'Egendefinert';
  } else if (relationToSource === 'basertPaaKilde') {
    return 'Basert på kilde';
  } if (relationToSource === 'sitatFraKilde') {
    return 'Sitat fra kilde';
  }
  return null;
}

export const deleteAllConcepts = async (apiRequestContext) => {
  const response = await apiRequestContext.get(`/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts`);
  if (!response.ok()) {
    throw new Error(`API call failed with status ${response.status()}`);
  }

  const concepts = await response.json();
  for (const concept of concepts) {
    await apiRequestContext.delete(`/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${concept.id}`);
  }
};

export const deleteConcept = async (apiRequestContext, conceptId) => {
  await apiRequestContext.delete(`/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${conceptId}`);  
};

export const createConcept = async (apiRequestContext, concept) => {
  const response = await apiRequestContext.post(`/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts`, {
    data: concept
  });

  if (!response.ok()) {
    console.error(`API call failed with status ${response.status()}`, await response.json());
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export const publishConcept = async (apiRequestContext, conceptId) => {
  const response = await apiRequestContext.post(`/api/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${conceptId}/publish`);

  if (!response.ok()) {
    console.error(`API call failed with status ${response.status()}`, await response.json());
    throw new Error(`API call failed with status ${response.status()}`);
  }

  return await response.json();
};

export enum ConceptStatus {
  DRAFT = 'http://publications.europa.eu/resource/authority/concept-status/DRAFT',
  CANDIDATE = 'http://publications.europa.eu/resource/authority/concept-status/CANDIDATE',
  WAITING = 'http://publications.europa.eu/resource/authority/concept-status/WAITING',
  CURRENT = 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
  RETIRED = 'http://publications.europa.eu/resource/authority/concept-status/RETIRED',
  REJECTED = 'internal codes - REJECTED'
}