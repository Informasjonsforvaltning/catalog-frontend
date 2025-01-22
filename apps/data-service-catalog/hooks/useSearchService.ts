import { searchResourcesWithFilter, searchSuggestions } from '@catalog-frontend/data-access';
import { Search } from '@catalog-frontend/types';
import { useQuery } from '@tanstack/react-query';

export const useSearchDatasetSuggestions = (searchEnv: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ['searchDatasetSuggestions', 'searchQuery', searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(searchEnv, searchQuery, 'datasets');
      const data = await res.json();
      return data.suggestions;
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchDatasetsByUri = (searchEnv: string, uriList: string[]) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
  };
  return useQuery({
    queryKey: ['searchDatasetByUri', 'uriList', uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(searchEnv, 'datasets', searchOperation);
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};
