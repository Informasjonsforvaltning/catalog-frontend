import {ReferenceDataGraphql, searchReferenceData, searchReferenceDataByUri} from '@catalog-frontend/data-access';
import {useQuery} from '@tanstack/react-query';

export const useSearchMediaTypes = (searchQuery: string, envVariable: string) => {
  return useQuery({
    queryKey: ['IANA_TYPES', 'searchQuery', searchQuery],
    queryFn: async () => {
      return await searchReferenceData(searchQuery, envVariable, [
        ReferenceDataGraphql.SearchAlternative.IanaMediaTypes,
      ]);
    },
    enabled: !!searchQuery,
  });
};

export const useSearchMediaTypeByUri = (uriList: string[] | undefined, envVariable: string) => {
  return useQuery({
    queryKey: ['IANA_TYPES', 'uriList', uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      return await searchReferenceDataByUri(uriList, envVariable, [
        ReferenceDataGraphql.SearchAlternative.IanaMediaTypes,
      ]);
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchFileTypes = (searchQuery: string, envVariable: string) => {
  return useQuery({
    queryKey: ['FileTypes', 'searchQuery', searchQuery],
    queryFn: async () => {
      return await searchReferenceData(searchQuery, envVariable, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: !!searchQuery,
  });
};

export const useSearchFileTypeByUri = (uriList: string[] | undefined, envVariable: string) => {
  return useQuery({
    queryKey: ['FileTypes', 'uriList', uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      return await searchReferenceDataByUri(uriList, envVariable, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};
