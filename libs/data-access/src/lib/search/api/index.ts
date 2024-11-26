import { Search } from '@catalog-frontend/types';

type SearchOperation = Search.SearchOperation;

const searchApi = ({
  path,
  searchOperation,
}: {
  path: string;
  searchOperation?: SearchOperation;
}) => {
  return fetch(`${process.env.FDK_SEARCH_SERVICE_BASE_URI}/search${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(searchOperation),
  });
};

export const searchConceptsByUri = (uri: string[]) => {
  const searchOperation: SearchOperation = {
    filters: {
      uri: { value: uri },
    },
    fields: {
      title: false,
      description: false,
      keyword: false,
    },
    pagination: {
      page: 0,
      size: 100,
    },
  };

  return searchConcepts(searchOperation);
};

export const searchConcepts = (searchOperation: SearchOperation) => {
  return searchApi({
    path: '/concepts',
    searchOperation,
  });
};

export const searchConceptSuggestions = (env: string, query: string) => {
  const path = `suggestions/concepts?q=${query}`;
  return fetch(`${env}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
};

export const searchSuggestions = async (
  searchEnv: string,
  query?: string,
  resourceType?: string,
): Promise<Response> => {
  const path = `suggestions/${resourceType}?q=${query}`;
  return fetch(`${searchEnv}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
};

export const searchResourcesWithFilter = async (
  searchEnv: string,
  resourceType?: string,
  body?: SearchOperation,
): Promise<Response> => {
  const path = `search/${resourceType}`;
  return fetch(`${searchEnv}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
};
