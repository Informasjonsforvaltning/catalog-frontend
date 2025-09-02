import { ChangeRequestStatus } from '@catalog-frontend/types';
import { validateOrganizationNumber, validateUUID, validateAndEncodeUrlSafe } from '@catalog-frontend/utils';

const path = `${process.env.CONCEPT_CATALOG_BASE_URI}`;

export const getChangeRequests = async (catalogId: string, accessToken: string) => {
  validateOrganizationNumber(catalogId, 'getChangeRequests');
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'getChangeRequests');

  const resource = `${path}/${encodedCatalogId}/endringsforslag`;
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'searchChangeRequest');

  const encodedConceptId = encodeURIComponent(conceptId);
  const encodedStatus = status ? encodeURIComponent(status) : '';
  const resource =
    `${path}/${encodedCatalogId}/endringsforslag?concept=${encodedConceptId}` +
    (status ? `&status=${encodedStatus}` : '');
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'getChangeRequest');
  const encodedChangeRequestId = validateAndEncodeUrlSafe(changeRequestId, 'change request ID', 'getChangeRequest');

  const resource = `${path}/${encodedCatalogId}/endringsforslag/${encodedChangeRequestId}`;
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'createChangeRequest');

  const resource = `${path}/${encodedCatalogId}/endringsforslag`;
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'updateChangeRequest');
  const encodedChangeRequestId = validateAndEncodeUrlSafe(changeRequestId, 'change request ID', 'updateChangeRequest');

  const resource = `${path}/${encodedCatalogId}/endringsforslag/${encodedChangeRequestId}`;
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'acceptChangeRequest');
  const encodedChangeRequestId = validateAndEncodeUrlSafe(changeRequestId, 'change request ID', 'acceptChangeRequest');

  const resource = `${path}/${encodedCatalogId}/endringsforslag/${encodedChangeRequestId}/accept`;
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
  const encodedCatalogId = validateAndEncodeUrlSafe(catalogId, 'catalog ID', 'rejectChangeRequest');
  const encodedChangeRequestId = validateAndEncodeUrlSafe(changeRequestId, 'change request ID', 'rejectChangeRequest');

  const resource = `${path}/${encodedCatalogId}/endringsforslag/${encodedChangeRequestId}/reject`;
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
