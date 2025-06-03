import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = (catalogId: string) => {
  return useQuery({
    queryKey: ['getUsers', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/catalogs/${catalogId}/users`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};
