export const searchConceptsForCatalog = async (
  catalog_id: string,
  access_token: string,
  query = ''
) => {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/begreper/search?orgNummer=${catalog_id}`;
  const options = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query}),
    method: 'POST',
  };
  const response = await fetch(resource, options)
    .then((res) => res.json())
    .catch((err) =>
      console.error('searchConceptsForCatalog failed with: ', err)
    );
  return response;
};
