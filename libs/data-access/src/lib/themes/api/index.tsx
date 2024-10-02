export const getLosThemes = async (accessToken: string) => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/los/themes-and-words`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};

export const getDataThemes = async (accessToken: string) => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/data-themes`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return await fetch(resource, options);
};
