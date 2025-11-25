import { AssignedUser } from "@catalog-frontend/types";
import { Operation } from "fast-json-patch";
import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getUsers = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, "getUsers");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getUsers",
  );

  const resource = `${path}/${encodedCatalogId}/general/users`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  return fetch(resource, options);
};

export const createUser = async (
  user: Partial<AssignedUser>,
  accessToken: string,
  catalogId: string,
) => {
  validateOrganizationNumber(catalogId, "createUser");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "createUser",
  );

  const resource = `${path}/${encodedCatalogId}/general/users`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(user),
  };
  return fetch(resource, options);
};

export const patchUser = async (
  catalogId: string,
  userId: string,
  accessToken: string,
  diff: Operation[],
) => {
  validateOrganizationNumber(catalogId, "patchUser");
  validateUUID(userId, "patchUser");

  if (diff.length > 0) {
    const encodedCatalogId = validateAndEncodeUrlSafe(
      catalogId,
      "catalog ID",
      "patchUser",
    );
    const encodedUserId = validateAndEncodeUrlSafe(
      userId,
      "user ID",
      "patchUser",
    );
    const resource = `${path}/${encodedCatalogId}/general/users/${encodedUserId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(diff),
    };
    return fetch(resource, options);
  }
};

export const deleteUser = async (
  catalogId: string,
  userId: string,
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "deleteUser");
  validateUUID(userId, "deleteUser");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "deleteUser",
  );
  const encodedUserId = validateAndEncodeUrlSafe(
    userId,
    "user ID",
    "deleteUser",
  );

  const resource = `${path}/${encodedCatalogId}/general/users/${encodedUserId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(resource, options);
};
