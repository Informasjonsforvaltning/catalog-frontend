import { getEnheterByOrgNmbs, searchEnheter } from '@catalog-frontend/data-access';
import { Enhet } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { useQuery } from '@tanstack/react-query';

export const useSearchEnheter = (searchQuery: string) => {
  return useQuery<Enhet[]>({
    queryKey: ['searchEnheter', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await searchEnheter(searchQuery);
      if (!res.ok) throw new Error(localization.datasetForm.errors.qualifiedAttributions);
      const data = await res.json();
      return data._embedded.enheter as Enhet[];
    },
    enabled: !!searchQuery,
  });
};
export const useSearchEnheterByOrgNmbs = (orgNmbs?: string[]) => {
  return useQuery<Enhet[]>({
    queryKey: ['searchEnheterByOrgNmbs', orgNmbs],
    queryFn: async () => {
      if (!orgNmbs || orgNmbs.length === 0) return []; // Early return
      const res = await getEnheterByOrgNmbs(orgNmbs);
      if (!res.ok) throw new Error(localization.datasetForm.errors.qualifiedAttributions);
      const data = await res.json();
      return data._embedded.enheter as Enhet[];
    },
    enabled: Array.isArray(orgNmbs) && orgNmbs.length > 0,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
