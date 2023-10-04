import { ChangeRequest } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useMutation, useQuery } from '@tanstack/react-query';

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
    mutationFn: async (changeRequest: ChangeRequest) => {
      return Promise.reject('Not implemented');
    },
  });
};

export const useUpdateChangeRequest = ({ catalogId, changeRequestId }) => {
  return useMutation({
    mutationFn: async (changeRequest: ChangeRequest) => {
      return Promise.reject('Not implemented');
    },
  });
};
