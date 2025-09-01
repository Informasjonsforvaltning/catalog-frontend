'use server';

export const createImportJob = async (catalogId: string, accessToken: string) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${catalogId}/createImportId`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  };

  return await fetch(resource, options).then((res) => res.headers.get('location'));
}

export const importRdfConcepts = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  importId: string,
  accessToken: string
) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${catalogId}/${importId}`;

  console.log("Uploading the concept rdf file catalog:", catalogId);
  console.log("Updating status of import result with id:", importId);

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
    },
    method: 'POST',
    body: fileContent,
  };

  return await fetch(resource, options).then((res) => res.headers.get('location'));
}