import { Design } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

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
        return signIn('keycloak');
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
        signIn('keycloak');
        return;
      }

      return response.text();
    },
  });
