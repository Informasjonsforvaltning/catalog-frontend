import {
  searchResourcesWithFilter,
  searchSuggestions,
} from "@catalog-frontend/data-access";
import { Search } from "@catalog-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchInformationModelsSuggestions = (
  searchEnv: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: ["searchInformationModelSuggestions", searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(
        searchEnv,
        searchQuery,
        "informationmodels",
      );
      const data = await res.json();
      return data.suggestions as Search.Suggestion[];
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchConceptSuggestions = (
  searchEnv: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: ["searchConceptSuggestions", searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(searchEnv, searchQuery, "concepts");
      const data = await res.json();
      return data?.suggestions;
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchInformationModelsByUri = (
  searchEnv: string,
  uriList: string[],
) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
    pagination: { page: 0, size: 100 },
  };
  return useQuery({
    queryKey: ["searchInformationModelsByUri", uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(
        searchEnv,
        "informationmodels",
        searchOperation,
      );
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};

// Dataservices

export const useSearchDataServiceSuggestions = (
  searchEnv: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: ["searchDataServiceSuggestions", searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(
        searchEnv,
        searchQuery,
        "dataservices",
      );
      const data = await res.json();
      return data.suggestions;
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchDataServiceByUri = (
  searchEnv: string,
  uriList: string[],
) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
    pagination: { page: 0, size: 100 },
  };
  return useQuery({
    queryKey: ["searchDataServicesByUri", uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(
        searchEnv,
        "dataservices",
        searchOperation,
      );
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};

export const useSearchConceptsByUri = (
  searchEnv: string,
  uriList: string[],
) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
    pagination: { page: 0, size: 100 },
  };
  return useQuery({
    queryKey: ["searchConceptSuggestions", "uriList", uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(
        searchEnv,
        "concepts",
        searchOperation,
      );
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};

export const useSearchDatasetSuggestions = (
  searchEnv: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: ["searchDatasetSuggestions", "searchQuery", searchQuery],
    queryFn: async () => {
      const res = await searchSuggestions(searchEnv, searchQuery, "datasets");
      const data = await res.json();
      return data.suggestions;
    },
    enabled: !!searchQuery && !!searchEnv,
  });
};

export const useSearchDatasetsByUri = (
  searchEnv: string,
  uriList: string[],
) => {
  const searchOperation: Search.SearchOperation = {
    filters: { uri: { value: uriList } },
    pagination: { page: 0, size: 100 },
  };
  return useQuery({
    queryKey: ["searchDatasetByUri", "uriList", uriList],
    queryFn: async () => {
      if (uriList.length === 0) {
        return [];
      }
      const res = await searchResourcesWithFilter(
        searchEnv,
        "datasets",
        searchOperation,
      );
      const data = await res.json();
      return data.hits as Search.SearchObject[];
    },
    enabled: !!uriList && !!searchEnv,
  });
};
