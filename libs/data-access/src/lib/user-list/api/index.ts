import { User } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`;

export const getUsers = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/general/user-list`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const createUser = async (user: Partial<User>, accessToken: string, catalogId: string) => {
  const resource = `${path}/${catalogId}/general/user-list`;
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
  if (diff.length > 0) {
    const resource = `${path}/${catalogId}/general/user-list/${userId}`;
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
  const resource = `${path}/${catalogId}/general/user-list/${userId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
