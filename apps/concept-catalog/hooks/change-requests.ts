import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

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
        signIn('keycloak');
        return;
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};
