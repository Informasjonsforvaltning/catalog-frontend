import { ConceptStatuses } from '@catalog-frontend/types';
import { useQuery } from '@tanstack/react-query';

export const useGetConceptStatuses = () =>
  useQuery<ConceptStatuses>({
    queryKey: ['getConceptStatuses'],
    queryFn: async () => {
      const response = await fetch(`/api/reference-data/concept-statuses`, {
        method: 'GET',
      });

      return response.json();
    },
  });
