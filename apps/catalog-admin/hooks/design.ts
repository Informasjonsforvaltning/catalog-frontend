import { Design } from '@catalog-frontend/types';
import { colorRegex, textRegexWithNumbers, validOrganizationNumber } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';

export const useGetDesign = (catalogId) =>
  useQuery<Design>({
    queryKey: ['getDesign', catalogId],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return null;
      }
      const response = await fetch(`/api/design/${catalogId}/design`, {
        method: 'GET',
      });

      if (response.status === 401) {
        return null;
      }
      return response.json();
    },
  });

export const useUpdateDesign = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ oldDesign, newDesign }: { oldDesign: Design; newDesign: Design }) => {
      const diff = compare(oldDesign, newDesign);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (!colorRegex.test(newDesign.fontColor ?? '')) {
        throw new Error('Invalid font color format');
      }

      if (!colorRegex.test(newDesign.backgroundColor ?? '')) {
        throw new Error('Invalid background color format');
      }

      if (!textRegexWithNumbers.test(newDesign.logoDescription ?? '')) {
        throw new Error('Invalid logo description');
      }

      if (diff) {
        const response = await fetch(`/api/design/${catalogId}/design`, {
          method: 'PATCH',
          body: JSON.stringify(diff),
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('Failed to update design', response.status, response.statusText);
          throw new Error('Failed to update design');
        }
        return response;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDesign', catalogId] });
    },
  });
};

type LogoResult = { body: string; headers: Headers } | null;

export const useGetLogo = (catalogId: string) =>
  useQuery<LogoResult, Error>({
    queryKey: ['getLogo', catalogId],
    queryFn: async (): Promise<LogoResult> => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/design/${catalogId}/logo`, {
        method: 'GET',
      });

      if (response.status === 404) {
        return null;
      }

      if (response.status === 401) {
        return null;
      }

      const responseBody = await response.text();
      return { body: responseBody, headers: response.headers };
    },
  });

export const useUpdateLogo = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: any) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }
      const formData = new FormData();
      formData.append('logo', file);

      const res = await fetch(`/api/design/${catalogId}/logo`, {
        method: 'POST',
        body: formData,
      });
      return res;
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getLogo', catalogId] });
    },
  });
};

export const useDeleteLogo = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/design/${catalogId}/logo`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getLogo', catalogId] });
    },
  });
};
