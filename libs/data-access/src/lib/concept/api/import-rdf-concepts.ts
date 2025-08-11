'use server';

export const importRdfConcepts = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  accessToken: string
) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${catalogId}`;

  console.log("Uploading the concept rdf file catalog:", catalogId);
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