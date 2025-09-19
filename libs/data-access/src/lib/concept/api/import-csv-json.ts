'use server';

import { Concept } from '@catalog-frontend/types';

export const importConceptsCSV = async (
  catalogId: string,
  importId: string,
  concepts: Concept[],
  accessToken: string,
) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${catalogId}/${importId}`;

  console.log('sending concepts', concepts);

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(concepts),
  };

  return await fetch(resource, options).then((res) => res.headers.get('location'));
};
