import { Search } from '@catalog-frontend/types';

type SearchOperation = Search.SearchOperation;

const searchApi = ({ path, searchOperation }: { path: string; searchOperation?: SearchOperation }) => {
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
