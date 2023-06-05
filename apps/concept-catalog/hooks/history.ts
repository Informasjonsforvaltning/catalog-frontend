import { useQuery } from '@tanstack/react-query';

export const useGetHistory = ({ catalogId, resourceId }) => {
  return useQuery({
    queryKey: ['getHistory', resourceId],
    queryFn: async () => {
      const response = await fetch(`/api/history/${catalogId}/${resourceId}`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};
