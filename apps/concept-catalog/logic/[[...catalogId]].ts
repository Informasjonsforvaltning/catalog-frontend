import {SearchableField} from '@catalog-frontend/types';
import {localization} from '@catalog-frontend/utils';
import {SingleSelectOption} from '@digdir/design-system-react';

interface Fields {
  anbefaltTerm: boolean;
  frarådetTerm: boolean;
  tillattTerm: boolean;
  definisjon: boolean;
  merknad: boolean;
}

export interface PageUpdate {
  catalogId: string;
  searchTerm: string;
  page:
    | {
        selected: number;
      }
    | number;
  fields: Fields;
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

export const getFields = (field: SearchableField | 'alleFelter'): Fields => {
  if (field === 'alleFelter') {
    return fields;
  } else {
    return {...getNegatedFields(), [field]: true};
  }
};

export const getSelectOptions = (): SingleSelectOption[] => {
  const fieldKeys = Object.keys(localization.search.fields);
  const fieldValues = Object.values(localization.search.fields);
  const options = fieldKeys.map((key, index) => ({
    value: key,
    label: fieldValues[index] as string,
  }));
  return options;
};

export const updatePage = async ({
  catalogId,
  searchTerm,
  page,
  fields,
}: PageUpdate) => {
  const hitsPerPage = 5;
  const body = JSON.stringify({
    catalogId,
    query: {
      query: searchTerm,
      pagination:
        typeof page === 'number'
          ? {page: page, size: hitsPerPage}
          : {page: page.selected + 1, size: hitsPerPage},
      fields: fields,
    },
  });

  const res = await fetch('/api/search', {
    method: 'POST',
    body: body,
  });

  const data = await res.json();
  return data;
};
