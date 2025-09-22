import { GetServiceMessagesDocument } from '../generated/graphql';

export const getAllServiceMessages = async () => {
  const resource = `${process.env.FDK_CMS_BASE_URI}/graphql`;

  const body = JSON.stringify({
    operationName: 'GetServiceMessages',
    variables: {
      today: new Date().toISOString(),
    },
    query: GetServiceMessagesDocument, // Use the document directly as a string
  });

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    method: 'POST',
    cache: 'default' as RequestCache,
  };

  const res = await fetch(resource, options);

  if (!res.ok) {
    console.error(`Error: ${res.status} ${res.statusText}`);
    return {
      status: res.status,
      data: null,
    };
  }

  return {
    status: res.status,
    data: await res.json(),
  };
};
