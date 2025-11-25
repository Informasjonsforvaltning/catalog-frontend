import {
  ReferenceDataGraphql,
  searchReferenceData,
  searchReferenceDataByUri,
} from "@catalog-frontend/data-access";
import { useQuery } from "@tanstack/react-query";

export const useSearchFileTypes = (
  searchQuery: string,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["FileTypes", "searchQuery", searchQuery],
    queryFn: async () => {
      return searchReferenceData(searchQuery, envVariable, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: !!searchQuery,
  });
};

export const useSearchFileTypeByUri = (
  uriList: string[] | undefined,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["FileTypes", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      return searchReferenceDataByUri(uriList, envVariable, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};
