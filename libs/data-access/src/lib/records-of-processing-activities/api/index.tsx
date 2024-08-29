const path = `${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI}`;

export const getAllProcessingActivities = async (accessToken: string) => {
  const resource = `${path}/api/organizations`;
  console.log('Path', resource);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  };
  return await fetch(resource, options);
};
