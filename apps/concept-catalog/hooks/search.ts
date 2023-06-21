import { QueryFilters, QuerySort, SearchableField } from '@catalog-frontend/types';
import { MultiSelectOption } from '@digdir/design-system-react';
import { useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

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

/**
 *
 * @param fieldArray is either 'alleFelter' or 'alleTermer' or an array of searchable fields
 * @returns an object with the searchable fields as keys and true as value if the field is included in the array
 */
export const getFields = (fieldArray): FieldOptions => {
  if (fieldArray.length === 1) {
    if (fieldArray[0] === 'alleFelter') {
      return fields;
    }
    if (fieldArray[0] === 'alleTermer') {
      return { ...getNegatedFields(), anbefaltTerm: true, frarådetTerm: true, tillattTerm: true };
    }
  }

  const fieldOptions = { ...getNegatedFields() };
  for (const field in fieldOptions) {
    if (fieldArray.includes(field)) {
      fieldOptions[field] = true;
    }
  }
  return fieldOptions;
};

export const getSelectOptions = (object: any): MultiSelectOption[] => {
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
      fields,
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
        signIn('keycloak');
        return;
      }

      return response.json();
    },
  });
};
