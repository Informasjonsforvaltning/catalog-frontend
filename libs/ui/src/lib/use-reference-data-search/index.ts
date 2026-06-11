import {
  ReferenceDataGraphql,
  searchReferenceData,
  searchReferenceDataByUri,
} from "@catalog-frontend/data-access";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchGeoNamesAndEULocations = (
  searchQuery: string,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["LOCATIONS", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(
        searchQuery,
        envVariable,
        [
          ReferenceDataGraphql.SearchAlternative.GeoNames,
          ReferenceDataGraphql.SearchAlternative.EuLocations,
        ],
      );
      return data;
    },
    enabled: !!searchQuery,
  });
};

export const useSearchLocationsByUri = (
  uriList: string[] | undefined,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["LOCATIONS", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        envVariable,
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

export const useSearchMediaTypes = (
  searchQuery: string,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["IANA_TYPES", "searchQuery", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(
        searchQuery,
        envVariable,
        [ReferenceDataGraphql.SearchAlternative.IanaMediaTypes],
      );
      return data;
    },
    enabled: !!searchQuery,
  });
};

export const useSearchMediaTypeByUri = (
  uriList: string[] | undefined,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["IANA_TYPES", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        envVariable,
        [ReferenceDataGraphql.SearchAlternative.IanaMediaTypes],
      );
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchFileTypes = (
  searchQuery: string,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["FileTypes", "searchQuery", searchQuery],
    queryFn: async () => {
      return await searchReferenceData(searchQuery, envVariable, [
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

      return await searchReferenceDataByUri(uriList, envVariable, [
        ReferenceDataGraphql.SearchAlternative.EuFileTypes,
      ]);
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};

export const useSearchLanguage = (searchQuery: string, envVariable: string) => {
  return useQuery({
    queryKey: ["LANGUAGES", "searchQuery", searchQuery],
    queryFn: async () => {
      const data: ReferenceDataCode[] = await searchReferenceData(
        searchQuery,
        envVariable,
        [ReferenceDataGraphql.SearchAlternative.EuLanguages],
      );
      return data;
    },
    enabled: !!searchQuery,
  });
};

export const useSearchLanguageByUri = (
  uriList: string[] | undefined,
  envVariable: string,
) => {
  return useQuery({
    queryKey: ["LANGUAGES", "uriList", uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data: ReferenceDataCode[] = await searchReferenceDataByUri(
        uriList,
        envVariable,
        [ReferenceDataGraphql.SearchAlternative.EuLanguages],
      );
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};
