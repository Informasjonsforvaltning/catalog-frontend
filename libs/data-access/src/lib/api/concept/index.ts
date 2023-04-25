export const searchConceptsForCatalog = async (
  catalogId: string,
  accessToken: string,
  query = ''
) => {

  const resource = `https://concept-catalog.staging.fellesdatakatalog.digdir.no/begreper/search?orgNummer=${catalogId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
