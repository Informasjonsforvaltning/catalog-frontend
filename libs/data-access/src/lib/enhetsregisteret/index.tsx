import { onlyNumbersRegex } from '@catalog-frontend/utils';

const enhetsregisteretPath = 'https://data.brreg.no/enhetsregisteret/api/enheter';

export const getEnheterByOrgNmbs = async (orgNmbs?: string[]) => {
  const orgNmbsAsString = orgNmbs?.join(',');
  const resource = `${enhetsregisteretPath}?organisasjonsnummer=${orgNmbsAsString}`;
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
  const resource =
    onlyNumbersRegex.test(query) && query.length === 9
      ? `${enhetsregisteretPath}?organisasjonsnummer=${query}`
      : `${enhetsregisteretPath}?navn=${query}`;

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'default' as RequestCache,
  };
  return await fetch(resource, options);
};
