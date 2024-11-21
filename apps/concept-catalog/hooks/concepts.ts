import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';

const callConceptApi = async (catalogId: string, conceptId: string, path: string, method: string) => {
  if (!validOrganizationNumber(catalogId)) {
    return Promise.reject(new Error('Invalid catalog id'));
  }
  if (!validUUID(conceptId)) {
    return Promise.reject(new Error('Invalid concept id'));
  }

  const response = await fetch(`/api/concepts/${catalogId}/${conceptId}/${path}`, { method });

  if (response.status === 401) {
    return Promise.reject(new Error('Unauthorized'));
  }

  return await response.json();
};

export const usePublishConcept = (catalogId: string) => {
  const mutation = useMutation({
    mutationKey: ['publishConcept'],
    mutationFn: async (conceptId: string) => callConceptApi(catalogId, conceptId, 'publish', 'POST'),
  });
  return mutation;
};

export const useDeleteConcept = (catalogId: string) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['deleteConcept'],
    mutationFn: async (conceptId: string) => {
      callConceptApi(catalogId, conceptId, '', 'DELETE');
    },
    onSuccess() {
      if (validOrganizationNumber(catalogId)) {
        router.push(`/catalogs/${catalogId}`);
      }
    },
  });
  return mutation;
};
