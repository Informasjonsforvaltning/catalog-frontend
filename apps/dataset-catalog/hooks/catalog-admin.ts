import { Design } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetCatalogDesign = (catalogId: string) =>
  useQuery<Design>({
    queryKey: ['getCatalogDesign', catalogId],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return null;
      }

      const response = await fetch(`/api/catalog-admin/${catalogId}/design`, {
        method: 'GET',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      const json = await response.json();
      return json;
    },
  });
