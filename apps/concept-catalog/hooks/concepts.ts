import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { signIn } from 'next-auth/react';

export const useCreateConcept = (catalogId: string) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ['createConcept'],
    mutationFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const response = await fetch(`/api/concepts/${catalogId}`, { method: 'POST' });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response.json();
    },
    onSuccess(data) {
      if (validOrganizationNumber(catalogId) && validUUID(data.conceptId)) {
        router
          .push(`/${catalogId}/${data.conceptId}/edit`)
          .catch((err) => console.error('Failed to navigate to newly created concept: ', err));
      }
    },
  });
  return mutation;
};

export const useDeleteConcept = (catalogId: string) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['deleteConcept'],
    mutationFn: async (conceptId: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const response = await fetch(`/api/concepts/${catalogId}/${conceptId}`, { method: 'DELETE' });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response;
    },
    onSuccess() {
      if (validOrganizationNumber(catalogId)) {
        router.push(`/${catalogId}`).catch((err) => console.error('Failed to navigate to search page: ', err));
      }
    },
  });
  return mutation;
};
