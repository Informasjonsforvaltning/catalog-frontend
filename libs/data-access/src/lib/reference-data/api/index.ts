export const getConceptStatuses = async () => {
  const path = `${process.env.REFERENCE_DATA_BASE_URI}/reference-data/eu/concept-statuses`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'no-cache' as RequestCache,
  };
  return await fetch(path, options);
};
