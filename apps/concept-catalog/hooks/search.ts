import {SearchableField} from '@catalog-frontend/types';
import {localization} from '@catalog-frontend/utils';
import {SingleSelectOption} from '@digdir/design-system-react';
import {useQuery} from '@tanstack/react-query';

export type SortFields = 'SIST_ENDRET' | 'ELDST';
export type SortDirection = 'ASC' | 'DESC';

export interface FieldOptions {
  anbefaltTerm: boolean;
  frarådetTerm: boolean;
  tillattTerm: boolean;
  definisjon: boolean;
  merknad: boolean;
}

export interface SortOptions {
  field: SortFields;
  direction: SortDirection;
}

export interface PageUpdate {
  catalogId: string;
  searchTerm: string;
  page: number;
  fields: FieldOptions;
  sort?: SortOptions;
}

export const fields = {
  anbefaltTerm: true,
  frarådetTerm: true,
  tillattTerm: true,
  definisjon: true,
  merknad: true,
};

const getNegatedFields = () => {
  const negatedFields = {...fields};
  for (const field in negatedFields) {
    negatedFields[field] = false;
  }
  return negatedFields;
};

export const getFields = (field: SearchableField | 'alleFelter'): FieldOptions => {
  if (field === 'alleFelter') {
    return fields;
  } else {
    return {...getNegatedFields(), [field]: true};
  }
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

export const getDefaultSortOptions = (): SortOptions => ({
  field: 'SIST_ENDRET',
  direction: 'DESC',
});

export const useSearchConcepts = ({
  catalogId,
  searchTerm,
  page,
  fields,
  sort
}: PageUpdate) => {
  const hitsPerPage = 5;
  const body = {
    catalogId,
    query: {
      query: searchTerm,
      pagination: {
        page: page ?? 1, 
        size: hitsPerPage
      },
      fields: fields,
      sort
    },
  };

  return useQuery({
    queryKey: ["searchConcepts", body],
    queryFn: async () => {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response.json();
    },
  });
};
