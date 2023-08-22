import { validOrganizationNumber } from '@catalog-frontend/utils';
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
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};
