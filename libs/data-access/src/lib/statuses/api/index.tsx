export const getAdmsStatuses = async () => {
  const resource = "https://data.norge.no/reference-data/adms/statuses";
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(resource, options);
};
