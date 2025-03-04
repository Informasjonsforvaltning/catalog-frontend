const path = `${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_API_BASE_URI}`;

export const getAllProcessingActivities = async (accessToken: string) => {
  const resource = `${path}/api/organizations`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  };
  return await fetch(resource, options);
};
