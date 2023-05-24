export const getComments = async (orgNumber: string, topicId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  const response = await fetch(resource, options)
    .then((res) => {
      return res.json() 
    })
    .catch((err) => console.error('getComments failed with: ', err));

  return response;
};

export const createComment = async (orgNumber: string, topicId: string, comment: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment,
    }),
    method: 'POST',
    cache: 'no-cache' as RequestCache
  };
  const response = await fetch(resource, options)
    .then((res) => res.json())
    .catch((err) => console.error('createComment failed with: ', err));

  return response;
};

export const updateComment = async (
  orgNumber: string,
  topicId: string,
  commentId: string,
  comment: string,
  accessToken: string,
) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment/${commentId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment,
    }),
    method: 'PUT',
    cache: 'no-cache' as RequestCache 
  };
  const response = await fetch(resource, options)
    .then((res) => res.json())
    .catch((err) => console.error('updateComment failed with: ', err));

  return response;
};

export const deleteComment = async (orgNumber: string, topicId: string, commentId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment/${commentId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    cache: 'no-cache' as RequestCache
  };
  const response = await fetch(resource, options)
    .then((res) => res)
    .catch((err) => console.error('deleteComment failed with: ', err));

  return response;
};
