import { onlyNumbersRegex, validateOrganizationNumber } from '@catalog-frontend/utils';

const enhetsregisteretPath = 'https://data.brreg.no/enhetsregisteret/api/enheter';

export const getEnheterByOrgNmbs = async (orgNmbs?: string[]) => {
  if (orgNmbs && orgNmbs.length > 0) {
    // Validate all organization numbers
    orgNmbs.forEach((orgNmb, index) => {
      validateOrganizationNumber(orgNmb, `getEnheterByOrgNmbs[${index}]`);
    });
  }

  const orgNmbsAsString = orgNmbs?.join(',');
  const encodedOrgNmbs = orgNmbsAsString ? encodeURIComponent(orgNmbsAsString) : '';
  const resource = `${enhetsregisteretPath}?organisasjonsnummer=${encodedOrgNmbs}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'default' as RequestCache,
  };
  return await fetch(resource, options);
};

export const searchEnheter = async (query: string) => {
  // If query is a 9-digit number, validate it as an organization number
  if (onlyNumbersRegex.test(query) && query.length === 9) {
    validateOrganizationNumber(query, 'searchEnheter');
  }

  const encodedQuery = encodeURIComponent(query);
  const resource =
    onlyNumbersRegex.test(query) && query.length === 9
      ? `${enhetsregisteretPath}?organisasjonsnummer=${encodedQuery}`
      : `${enhetsregisteretPath}?navn=${encodedQuery}`;

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'default' as RequestCache,
  };
  return await fetch(resource, options);
};
