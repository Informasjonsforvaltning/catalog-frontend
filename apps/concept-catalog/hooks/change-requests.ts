import { ChangeRequestUpdateBody } from '@catalog-frontend/types';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetChangeRequests = (catalogId: string) => {
  return useQuery({
    queryKey: ['getChangeRequests', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/change-requests/${catalogId}`, {
        method: 'GET',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateChangeRequest = ({ catalogId }) => {
  return useMutation({
    mutationFn: async (changeRequest: ChangeRequestUpdateBody) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }
      if (changeRequest.conceptId !== null && !validUUID(changeRequest.conceptId)) {
        return Promise.reject('Invalid concept id for change request');
      }

      const response = await fetch(`/api/change-requests/${catalogId}`, {
        method: 'POST',
        body: JSON.stringify(changeRequest),
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      if (response.status !== 201) {
        return Promise.reject('Error when creating change request');
      }
      
      return await response.json();
    }
  });
};

export const useUpdateChangeRequest = ({ catalogId, changeRequestId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (changeRequest: ChangeRequestUpdateBody) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }
      if (!validUUID(changeRequestId)) {
        return Promise.reject('Invalid change request id');
      }

      const response = await fetch(`/api/change-requests/${catalogId}/${changeRequestId}`, {
        method: 'PUT',
        body: JSON.stringify(changeRequest),
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      if (response.status !== 200) {
        return Promise.reject('Error when updating change request');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getChangeRequests', catalogId] });
    },
  });
};
