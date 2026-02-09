import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

export const getComments = async (
  orgNumber: string,
  accessToken: string | undefined,
  page?: number,
  size?: number,
) => {
  validateOrganizationNumber(orgNumber, "getComments");
  const encodedOrgNumber = validateAndEncodeUrlSafe(
    orgNumber,
    "organization number",
    "getComments",
  );

  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", String(page));
  if (size !== undefined) params.set("size", String(size));
  const query = params.toString();

  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${encodedOrgNumber}${query ? `?${query}` : ""}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  return await fetch(resource, options);
};

export const getCommentsByTopicId = async (
  orgNumber: string,
  topicId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(orgNumber, "getCommentsByTopicId");
  validateUUID(topicId, "getCommentsByTopicId");
  const encodedOrgNumber = validateAndEncodeUrlSafe(
    orgNumber,
    "organization number",
    "getCommentsByTopicId",
  );
  const encodedTopicId = validateAndEncodeUrlSafe(
    topicId,
    "topic ID",
    "getCommentsByTopicId",
  );

  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${encodedOrgNumber}/${encodedTopicId}/comment`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  return await fetch(resource, options);
};

export const createComment = async (
  orgNumber: string,
  topicId: string,
  comment: string,
  accessToken: string,
) => {
  validateOrganizationNumber(orgNumber, "createComment");
  validateUUID(topicId, "createComment");
  const encodedOrgNumber = validateAndEncodeUrlSafe(
    orgNumber,
    "organization number",
    "createComment",
  );
  const encodedTopicId = validateAndEncodeUrlSafe(
    topicId,
    "topic ID",
    "createComment",
  );

  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${encodedOrgNumber}/${encodedTopicId}/comment`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment,
    }),
    method: "POST",
    cache: "no-cache" as RequestCache,
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
  validateOrganizationNumber(orgNumber, "updateComment");
  validateUUID(topicId, "updateComment");
  validateUUID(commentId, "updateComment");
  const encodedOrgNumber = validateAndEncodeUrlSafe(
    orgNumber,
    "organization number",
    "updateComment",
  );
  const encodedTopicId = validateAndEncodeUrlSafe(
    topicId,
    "topic ID",
    "updateComment",
  );
  const encodedCommentId = validateAndEncodeUrlSafe(
    commentId,
    "comment ID",
    "updateComment",
  );

  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${encodedOrgNumber}/${encodedTopicId}/comment/${encodedCommentId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment,
    }),
    method: "PUT",
    cache: "no-cache" as RequestCache,
  };

  return await fetch(resource, options);
};

export const deleteComment = async (
  orgNumber: string,
  topicId: string,
  commentId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(orgNumber, "deleteComment");
  validateUUID(topicId, "deleteComment");
  validateUUID(commentId, "deleteComment");
  const encodedOrgNumber = validateAndEncodeUrlSafe(
    orgNumber,
    "organization number",
    "deleteComment",
  );
  const encodedTopicId = validateAndEncodeUrlSafe(
    topicId,
    "topic ID",
    "deleteComment",
  );
  const encodedCommentId = validateAndEncodeUrlSafe(
    commentId,
    "comment ID",
    "deleteComment",
  );

  const resource = `${process.env.CATALOG_COMMENTS_SERVICE_BASE_URI}/${encodedOrgNumber}/${encodedTopicId}/comment/${encodedCommentId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
    cache: "no-cache" as RequestCache,
  };
  return await fetch(resource, options);
};
