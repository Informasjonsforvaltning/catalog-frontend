import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';

export const useCreateConcept = (catalogId: string) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ['createConcept'],
    mutationFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const response = await fetch(`/api/concepts/${catalogId}`, { method: 'POST' });
      return response.json();
    },
    onSuccess(data) {
      if (validOrganizationNumber(catalogId) && validUUID(data.conceptId)) {
        router
          .push(`/concept-catalog-gui/${catalogId}/${data.conceptId}`)
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

      return await fetch(`/api/concepts/${catalogId}/${conceptId}`, { method: 'DELETE' });
    },
    onSuccess(data) {
      if (validOrganizationNumber(catalogId)) {
        router.push(`/${catalogId}`).catch((err) => console.error('Failed to navigate to search page: ', err));
      }
    },
  });
  return mutation;
};
