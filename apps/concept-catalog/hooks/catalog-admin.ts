import { Design } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetCatalogDesign = (catalogId) =>
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

      return response.json();
    },
  });

export const useGetCatalogDesignLogo = (catalogId) =>
  useQuery<string>({
    queryKey: ['getCatalogDesignLogo', catalogId],
    queryFn: async () => {
      const response = await fetch(`/api/catalog-admin/${catalogId}/design/logo`, {
        method: 'GET',
      });

      if (response.status === 404) {
        return null;
      }

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response.text();
    },
  });
