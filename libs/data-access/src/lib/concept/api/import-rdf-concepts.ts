'use server';

import { validateOrganizationNumber, validateAndEncodeUrlSafe } from '@catalog-frontend/utils';

export const importRdfConcepts = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, 'importRdfConcepts');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'importRdfConcepts');

  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${encodedCatalogId}`;

  console.log('Uploading the concept rdf file catalog:', catalogId);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
    },
    method: 'POST',
    body: fileContent,
  };

  return await fetch(resource, options).then((res) => res.headers.get('location'));
};
