import { ChangeRequestStatus } from '@catalog-frontend/types';
import { validateOrganizationNumber, validateUUID } from '@catalog-frontend/utils';

const path = `${process.env.CONCEPT_CATALOG_BASE_URI}`;

export const getChangeRequests = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getChangeRequests');

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
  validateOrganizationNumber(catalogId, 'searchChangeRequest');

  const encodedConceptId = encodeURIComponent(conceptId);
  const encodedStatus = status ? encodeURIComponent(status) : '';
  const resource =
    `${path}/${catalogId}/endringsforslag?concept=${encodedConceptId}` + (status ? `&status=${encodedStatus}` : '');
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
  validateOrganizationNumber(catalogId, 'getChangeRequest');
  validateUUID(changeRequestId, 'getChangeRequest');

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
  validateOrganizationNumber(catalogId, 'createChangeRequest');

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
  validateOrganizationNumber(catalogId, 'updateChangeRequest');
  validateUUID(changeRequestId, 'updateChangeRequest');

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
  validateOrganizationNumber(catalogId, 'acceptChangeRequest');
  validateUUID(changeRequestId, 'acceptChangeRequest');

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
  validateOrganizationNumber(catalogId, 'rejectChangeRequest');
  validateUUID(changeRequestId, 'rejectChangeRequest');

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
