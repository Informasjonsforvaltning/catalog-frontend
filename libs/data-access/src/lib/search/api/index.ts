import { Search } from "@catalog-frontend/types";
import {
  validateURIs,
  validateSearchQuery,
  validateResourceType,
  validateEnvironmentURL,
} from "@catalog-frontend/utils";

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
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(searchOperation),
  });
};

export const searchConceptsByUri = (uri: string[]) => {
  validateURIs(uri, "searchConceptsByUri");

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
    path: "/concepts",
    searchOperation,
  });
};

export const searchConceptSuggestions = (env: string, query: string) => {
  validateEnvironmentURL(env, "searchConceptSuggestions");
  validateSearchQuery(query, "searchConceptSuggestions");

  const encodedQuery = encodeURIComponent(query);
  const path = `suggestions/concepts?q=${encodedQuery}`;
  return fetch(`${env}/${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
};

export const searchSuggestions = async (
  searchEnv: string,
  query?: string,
  resourceType?: string,
): Promise<Response> => {
  validateEnvironmentURL(searchEnv, "searchSuggestions");

  if (query) {
    validateSearchQuery(query, "searchSuggestions");
  }

  if (resourceType) {
    validateResourceType(resourceType, "searchSuggestions");
  }

  const encodedResourceType = resourceType
    ? encodeURIComponent(resourceType)
    : "";
  const encodedQuery = query ? encodeURIComponent(query) : "";
  const path = `suggestions/${encodedResourceType}?q=${encodedQuery}`;
  return fetch(`${searchEnv}/${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
};

export const searchResourcesWithFilter = async (
  searchEnv: string,
  resourceType?: string,
  body?: SearchOperation,
): Promise<Response> => {
  validateEnvironmentURL(searchEnv, "searchResourcesWithFilter");

  if (resourceType) {
    validateResourceType(resourceType, "searchResourcesWithFilter");
  }

  const encodedResourceType = resourceType
    ? encodeURIComponent(resourceType)
    : "";
  const path = `search/${encodedResourceType}`;
  return fetch(`${searchEnv}/${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });
};
