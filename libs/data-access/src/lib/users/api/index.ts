import { AssignedUser } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';
import { validateOrganizationNumber, validateUUID } from '@catalog-frontend/utils';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getUsers = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getUsers');

  const resource = `${path}/${catalogId}/general/users`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createUser = async (user: Partial<AssignedUser>, accessToken: string, catalogId: string) => {
  validateOrganizationNumber(catalogId, 'createUser');

  const resource = `${path}/${catalogId}/general/users`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  };
  return await fetch(resource, options);
};

export const patchUser = async (catalogId: string, userId: string, accessToken: string, diff: Operation[]) => {
  validateOrganizationNumber(catalogId, 'patchUser');
  validateUUID(userId, 'patchUser');

  if (diff.length > 0) {
    const resource = `${path}/${catalogId}/general/users/${userId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(diff),
    };
    return await fetch(resource, options);
  }
};

export const deleteUser = async (catalogId: string, userId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'deleteUser');
  validateUUID(userId, 'deleteUser');

  const resource = `${path}/${catalogId}/general/users/${userId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
