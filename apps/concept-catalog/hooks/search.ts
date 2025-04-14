'use client';

import { QueryFilters, QuerySort, SearchableField, SearchConceptResponse, Search } from '@catalog-frontend/types';
import { SelectOption } from '@catalog-frontend/ui';
import { useQuery } from '@tanstack/react-query';

export type SortFields = 'SIST_ENDRET' | 'ANBEFALT_TERM';
export type SortDirection = 'ASC' | 'DESC';

export interface FieldOptions {
  anbefaltTerm: boolean;
  frarådetTerm: boolean;
  tillattTerm: boolean;
  definisjon: boolean;
  merknad: boolean;
}

export enum SortOption {
  RELEVANCE = 'RELEVANCE',
  LAST_UPDATED_FIRST = 'LAST_UPDATED_FIRST',
  LAST_UPDATED_LAST = 'LAST_UPDATED_LAST',
  RECOMMENDED_TERM_AÅ = 'RECOMMENDED_TERM_AÅ',
  RECOMMENDED_TERM_ÅA = 'RECOMMENDED_TERM_ÅA',
}
export interface PageUpdate {
  catalogId: string;
  searchTerm: string;
  page: number;
  size?: number;
  fields: FieldOptions;
  sort?: QuerySort;
  filters?: QueryFilters;
  enabled?: boolean;
}

export const fields = {
  anbefaltTerm: true,
  frarådetTerm: true,
  tillattTerm: true,
  definisjon: true,
  merknad: true,
};

const getNegatedFields = () => {
  const negatedFields = { ...fields };
  for (const field in negatedFields) {
    negatedFields[field] = false;
  }
  return negatedFields;
};

export const getFields = (field: SearchableField | 'alleFelter' | 'alleTermer'): FieldOptions => {
  if (field === 'alleFelter') {
    return fields;
  }
  if (field === 'alleTermer') {
    return { ...getNegatedFields(), anbefaltTerm: true, frarådetTerm: true, tillattTerm: true };
  }
  return { ...getNegatedFields(), [field]: true };
};

export const getSelectOptions = (object: any): SelectOption[] => {
  if (!object) return [];
  const sortKeys = Object.keys(object);
  const sortValues = Object.values(object);
  const options = sortKeys.map((key, index) => ({
    value: key,
    label: sortValues[index] as string,
  }));

  return options;
};

export const useSearchConcepts = ({ catalogId, searchTerm, page, size = 5, fields, sort, filters, enabled }: PageUpdate) => {
  const body = {
    catalogId,
    query: {
      query: searchTerm,
      pagination: {
        page: page ?? 0,
        size,
      },
      fields: fields,
      sort,
      filters,
    },
  };

  return useQuery<SearchConceptResponse>({
    queryKey: ['searchConcepts', body],
    queryFn: async () => {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response.json();
    },
    enabled,
  });
};

export const useDataNorgeSearchConcepts = ({
  searchOperation,
  enabled,
}: {
  searchOperation: Search.SearchOperation;
  enabled?: boolean;
}) => {
  return useQuery<Search.SearchResult>({
    queryKey: ['searchExternalConcept', searchOperation],
    queryFn: async () => {
      const resource = '/api/data-norge/search';
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(searchOperation),
      };

      const response = await fetch(resource, options);
      return response.json();
    },
    enabled,
  });
};
