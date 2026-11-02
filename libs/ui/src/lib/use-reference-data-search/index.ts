import {
  ReferenceDataGraphql,
  searchReferenceData,
  searchReferenceDataByUri,
} from "@catalog-frontend/data-access";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useSearchGeoNamesAndEULocations = (searchQuery: string) => {
  return useQuery({
    queryKey: ["LOCATIONS", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(searchQuery, [
        ReferenceDataGraphql.SearchAlternative.GeoNames,
        ReferenceDataGraphql.SearchAlternative.EuLocations,
      ]);
      return data;
    },
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });
};

export const useSearchLocationsByUri = (uriList: string[] | undefined) => {
  return useQuery({
    queryKey: ["LOCATIONS", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        [
          ReferenceDataGraphql.SearchAlternative.AdministrativeEnheter,
          ReferenceDataGraphql.SearchAlternative.GeoNames,
          ReferenceDataGraphql.SearchAlternative.EuLocations,
        ],
      );
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchMediaTypes = (searchQuery: string) => {
  return useQuery({
    queryKey: ["IANA_TYPES", "searchQuery", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(searchQuery, [
        ReferenceDataGraphql.SearchAlternative.IanaMediaTypes,
      ]);
      return data;
    },
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });
};

export const useSearchMediaTypeByUri = (uriList: string[] | undefined) => {
  return useQuery({
    queryKey: ["IANA_TYPES", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        [ReferenceDataGraphql.SearchAlternative.IanaMediaTypes],
      );
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchFileTypes = (searchQuery: string) => {
  return useQuery({
    queryKey: ["FileTypes", "searchQuery", searchQuery],
    queryFn: async () => {
      return await searchReferenceData(searchQuery, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });
};

export const useSearchFileTypeByUri = (uriList: string[] | undefined) => {
  return useQuery({
    queryKey: ["FileTypes", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      return await searchReferenceDataByUri(uriList, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchLanguage = (searchQuery: string) => {
  return useQuery({
    queryKey: ["LANGUAGES", "searchQuery", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(searchQuery, [
        ReferenceDataGraphql.SearchAlternative.EuLanguages,
      ]);
      return data;
    },
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });
};

export const useSearchLanguageByUri = (uriList: string[] | undefined) => {
  return useQuery({
    queryKey: ["LANGUAGES", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        [ReferenceDataGraphql.SearchAlternative.EuLanguages],
      );
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};
