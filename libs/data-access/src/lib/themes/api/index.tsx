export const getLosThemes = async () => {
  const resource = `https://staging.fellesdatakatalog.digdir.no/reference-data/los/themes-and-words`; //env-variabel kommer i neste PR
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const getDataThemes = async () => {
  const resource = `https://staging.fellesdatakatalog.digdir.no/reference-data/eu/data-themes`; //env-variabel kommer i neste PR
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};
