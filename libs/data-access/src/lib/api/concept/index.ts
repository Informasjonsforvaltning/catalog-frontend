export const searchConceptsForCatalog = async (
  catalogId: string,
  accessToken: string,
  body = ''
) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/begreper/search?orgNummer=${catalogId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body,
    method: 'POST',
  };
  const response = await fetch(resource, options)
    .then((res) => res.json())
    .catch((err) =>
      console.error('searchConceptsForCatalog failed with: ', err)
    );
  return response;
};
