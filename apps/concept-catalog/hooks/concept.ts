import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

export const useCreateConcept = (catalogId: string) => {
  const router = useRouter();
  const options = { method: 'POST', body: catalogId };

  const mutation = useMutation({
    mutationKey: ['createConcept'],
    mutationFn: async () => {
      const response = await fetch('/api/concept', options);
      return response.json();
    },
    onSuccess(data) {
      router
        .push(`/${catalogId}/${data.conceptId}`)
        .catch((err) => console.error('Failed to navigate to newly created concept: ', err));
    },
  });
  return mutation;
};
