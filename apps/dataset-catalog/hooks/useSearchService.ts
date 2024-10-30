import { searchResourcesWithFilter, searchSuggestions } from '@catalog-frontend/data-access';
import { Search } from '@catalog-frontend/types';
import { useQuery } from '@tanstack/react-query';

export const useSearchInformationModelsSuggestions = (searchEnv: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ['searchInformationModelSuggestions', searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(searchEnv, searchQuery, 'informationmodels');
      const data = await res.json();
      return data.suggestions as Search.Suggestion[];
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchConceptSuggestions = (searchEnv: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ['searchConceptSuggestions', searchQuery],
    queryFn: async () => {
      const data = await searchSuggestions(searchEnv, searchQuery, 'concepts');
      return data.json();
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchInformationModelsByUri = (searchEnv: string, uriList: string[]) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
  };
  return useQuery({
    queryKey: ['searchInformationModelsByUri', uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(searchEnv, 'informationmodels', searchOperation);
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};
