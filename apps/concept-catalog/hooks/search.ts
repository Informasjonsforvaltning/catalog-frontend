'use client';

import { QueryFilters, QuerySort, SearchableField } from '@catalog-frontend/types';
import { SingleSelectOption } from '@digdir/design-system-react';
import { useQuery } from '@tanstack/react-query';

export type SortFields = 'SIST_ENDRET' | 'ANBEFALT_TERM_NB';
export type SortDirection = 'ASC' | 'DESC';

export interface FieldOptions {
  anbefaltTerm: boolean;
  frarådetTerm: boolean;
  tillattTerm: boolean;
  definisjon: boolean;
  merknad: boolean;
}

export enum SortOption {
  LAST_UPDATED_FIRST = 'LAST_UPDATED_FIRST',
  LAST_UPDATED_LAST = 'LAST_UPDATED_LAST',
  RECOMMENDED_TERM_AÅ = 'RECOMMENDED_TERM_AÅ',
  RECOMMENDED_TERM_ÅA = 'RECOMMENDED_TERM_ÅA',
}
export interface PageUpdate {
  catalogId: string;
  searchTerm: string;
  page: number;
  fields: FieldOptions;
  sort?: QuerySort;
  filters?: QueryFilters;
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

export const getSelectOptions = (object: any): SingleSelectOption[] => {
  if (!object) return [];
  const sortKeys = Object.keys(object);
  const sortValues = Object.values(object);
  const options = sortKeys.map((key, index) => ({
    value: key,
    label: sortValues[index] as string,
  }));
  return options;
};

export const useSearchConcepts = ({ catalogId, searchTerm, page, fields, sort, filters }: PageUpdate) => {
  const hitsPerPage = 5;
  const body = {
    catalogId,
    query: {
      query: searchTerm,
      pagination: {
        page: page ?? 0,
        size: hitsPerPage,
      },
      fields: fields,
      sort,
      filters,
    },
  };

  return useQuery({
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
  });
};
