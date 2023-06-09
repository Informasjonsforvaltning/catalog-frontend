import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetHistory = ({ catalogId, resourceId }) => {
  return useQuery({
    queryKey: ['getHistory', resourceId],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      if (!validUUID(resourceId)) {
        return Promise.reject('Invalid resource id');
      }

      const response = await fetch(`/api/history/${catalogId}/${resourceId}`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};
