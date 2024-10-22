import { getAdministrativeUnits, getAdministrativeUnitsByUri } from '@catalog-frontend/data-access';
import { useQuery } from '@tanstack/react-query';

export const useSearchAdministrativeUnits = (searchQuery: string, envVariable: string) => {
  return useQuery({
    queryKey: ['ADMINISTRATIVE_ENHETER', searchQuery],
    queryFn: async () => {
      const data = await getAdministrativeUnits(searchQuery, envVariable);
      return data;
    },
    enabled: !!searchQuery,
  });
};

export const useSearchAdministrativeUnitsByUri = (uriList: string[] | undefined, envVariable: string) => {
  return useQuery({
    queryKey: ['ADMINISTRATIVE_ENHETER', uriList],
    queryFn: async () => {
      if (!uriList || uriList.length === 0) {
        return [];
      }

      const data = await getAdministrativeUnitsByUri(uriList, envVariable);
      return data;
    },
    enabled: Array.isArray(uriList) && uriList.length > 0,
  });
};
