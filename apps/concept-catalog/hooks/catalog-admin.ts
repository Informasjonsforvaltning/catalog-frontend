import { getDesign } from '@catalog-frontend/data-access';
import { Design } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useGetCatalogDesign = (catalogId: string, adminEnvVariable?: string) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  return useQuery<Design>({
    queryKey: ['getCatalogDesign', catalogId],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid catalog ID');
      }

      const response = await getDesign(catalogId, accessToken, adminEnvVariable);

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      return response.json();
    },
    enabled: !!accessToken && !!catalogId,
  });
};
