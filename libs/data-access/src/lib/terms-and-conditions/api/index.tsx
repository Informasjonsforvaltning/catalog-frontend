import { TermsAcceptation } from '@catalog-frontend/types';
import { validateOrganizationNumber } from '@catalog-frontend/utils';

export const getLatestTerms = async () => {
  const resource = `${process.env.TERMS_AND_CONDITIONS_BASE_URI}/terms/latest`;
  const options = {
    headers: { Accept: 'application/json' },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getOrgAcceptation = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getOrgAcceptation');

  const resource = `${process.env.TERMS_AND_CONDITIONS_BASE_URI}/terms/org/${catalogId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    method: 'GET',
    next: { tags: ['terms-acceptation'] },
  };
  return await fetch(resource, options);
};

export const acceptTerms = async (acceptation: TermsAcceptation, accessToken: string) => {
  const resource = `${process.env.TERMS_AND_CONDITIONS_BASE_URI}/terms/org`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(acceptation),
  };
  return await fetch(resource, options);
};
