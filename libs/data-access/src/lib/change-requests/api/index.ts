import { ChangeRequest } from '@catalog-frontend/types';
import { Operation } from 'fast-json-patch';

const path = `${process.env.CONCEPT_CATALOG_BASE_URI}`;

export const getChangeRequests = async (catalogId: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const deleteChangeRequest = async (catalogId: string, changeRequest: string, accessToken: string) => {
  const resource = `${path}/${catalogId}/endringsforslag/${changeRequest}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  };
  return await fetch(resource, options);
};
