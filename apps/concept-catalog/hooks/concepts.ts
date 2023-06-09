import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';

export const useCreateConcept = (catalogId: string) => {
  const router = useRouter();
  const options = { method: 'POST', body: catalogId };

  const mutation = useMutation({
    mutationKey: ['createConcept'],
    mutationFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const response = await fetch('/api/concepts', options);
      return response.json();
    },
    onSuccess(data) {
      if (validOrganizationNumber(catalogId) && validUUID(data.conceptId)) {
        router
          .push(`/${catalogId}/${data.conceptId}`)
          .catch((err) => console.error('Failed to navigate to newly created concept: ', err));
      }
    },
  });
  return mutation;
};
