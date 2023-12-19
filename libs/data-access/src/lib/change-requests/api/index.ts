import { ChangeRequestStatus } from '@catalog-frontend/types';

const path = `${process.env.CONCEPT_CATALOG_BASE_URI}`;

export const getChangeRequests = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
    next: { tags: ['concept-change-requests'] },
  };
  return await fetch(resource, options);
};

export const searchChangeRequest = async (
  catalogId: string,
  conceptId: string,
  accessToken: string,
  status?: ChangeRequestStatus,
) => {
  const resource = `${path}/${catalogId}/endringsforslag?concept=${conceptId}` + (status ? `&status=${status}` : '');
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
    next: { tags: ['concept-change-requests'] },
  };
  return await fetch(resource, options);
};

export const getChangeRequest = async (catalogId: string, changeRequestId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
    next: { tags: ['concept-change-request'] },
  };
  return await fetch(resource, options);
};

export const createChangeRequest = async (body: any, catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  };
  return await fetch(resource, options);
};

export const updateChangeRequest = async (
  body: any,
  catalogId: string,
  changeRequestId: string,
  accessToken: string,
) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  };
  return await fetch(resource, options);
};

export const acceptChangeRequest = async (catalogId: string, changeRequestId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}/accept`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: '{}',
  };
  return await fetch(resource, options);
};

export const rejectChangeRequest = async (catalogId: string, changeRequestId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequestId}/reject`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: '{}',
  };
  return await fetch(resource, options);
};
