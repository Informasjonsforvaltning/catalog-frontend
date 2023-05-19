import { SearchableField } from '@catalog-frontend/types';
import { SingleSelectOption } from '@digdir/design-system-react';

export const fields = {
  anbefaltTerm: true,
  frarådetTerm: true,
  tillattTerm: true,
  definisjon: true,
  merknad: true,
};

export type SortFields = 'SIST_ENDRET' | 'ELDST';
export type SortDirection = 'ASC' | 'DESC';
export type Page = { selected: number } | number;

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
  page: Page;
  fields: FieldOptions;
  sort?: SortOptions;
}

export const getNegatedFields = () => {
  const negatedFields = { ...fields };
  for (const field in negatedFields) {
    negatedFields[field] = false;
  }
  return negatedFields;
};

export const getFields = (field: SearchableField | 'alleFelter'): FieldOptions => {
  if (field === 'alleFelter') {
    return fields;
  } else {
    return { ...getNegatedFields(), [field]: true };
  }
};

export const getSelectOptions = (jsonOptions: any): SingleSelectOption[] => {
  if (!jsonOptions) return [];
  const sortKeys = Object.keys(jsonOptions);
  const sortValues = Object.values(jsonOptions);
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

export const updatePage = async ({ catalogId, searchTerm, page, fields, sort }: PageUpdate) => {
  const hitsPerPage = 5;
  const body = JSON.stringify({
    catalogId,
    query: {
      query: searchTerm,
      pagination:
        typeof page === 'number' ? { page: page, size: hitsPerPage } : { page: page.selected + 1, size: hitsPerPage },
      fields: fields,
      sort: sort,
    },
  });

  const res = await fetch('/api/search', {
    method: 'POST',
    body: body,
  });

  const data = await res.json();
  return data;
};
