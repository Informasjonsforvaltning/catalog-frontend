import { useMutation } from '@tanstack/react-query';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { importDataService } from '@catalog-frontend/data-access';
import { useSession } from 'next-auth/react';

export const useImport = (catalogId: string, contentType: string) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  return useMutation({
    mutationFn: async (fileContent: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const res = await importDataService(fileContent, contentType, catalogId, accessToken);
      return Promise.resolve();
    },
  });
};
