export const getComments = async (orgNumber: string, topicId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  return await fetch(resource, options);
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
    cache: 'no-cache' as RequestCache,
  };

  return await fetch(resource, options);
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
    cache: 'no-cache' as RequestCache,
  };

  return await fetch(resource, options);
};

export const deleteComment = async (orgNumber: string, topicId: string, commentId: string, accessToken: string) => {
  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${orgNumber}/${topicId}/comment/${commentId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    cache: 'no-cache' as RequestCache,
  };
  return await fetch(resource, options);
};
