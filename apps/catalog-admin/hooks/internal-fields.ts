import { Field } from '@catalog-frontend/types';
import { getTranslateText, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';

const validateLabelField = (label: string) => {
  /* Can contain letters from the english alphabet, number, space, æ@å and -.,?+&%. Cannot be empty
     - Can contain letteres and numbers 
     - Can contain space (but not start or end with it)
     - Must contain one or more characters
     - Can contain æøå and  -.,?+&%
  */
  const labelRegex = /^(?! )(?!.* $)[\wæøåÆØÅ\s\-.,?!+&%]+$/;
  return labelRegex.test(label);
};

export const useGetInternalFields = (catalogId: string) => {
  return useQuery({
    queryKey: ['getInternalFields', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/internal-fields/${catalogId}`, {
        method: 'GET',
      });
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateInternalField = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: Field) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      if (!field.label) {
        return Promise.reject('Internal field must have a label');
      }

      // if (!validateLabelField(String(getTranslateText(String(field.label))))) {
      //   return Promise.reject('Internal field label must have correct format');
      // }

      const response = await fetch(`/api/internal-fields/${catalogId}`, {
        method: 'POST',
        body: JSON.stringify({
          field,
        }),
        cache: 'no-store',
      });
      return response.json();
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getInternalFields', catalogId] });
    },
  });
};

export const useUpdateInternalField = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ beforeUpdateField, updatedField }: { beforeUpdateField: Field; updatedField: Field }) => {
      const diff = compare(beforeUpdateField, updatedField);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (!validUUID(beforeUpdateField.id)) {
        throw new Error('Invalid field id');
      }

      if (!updatedField.label) {
        return Promise.reject('Internal field must have a label');
      }

      const label = String(getTranslateText(updatedField.label));
      if (!validateLabelField(label)) {
        return Promise.reject('Internal field label must have correct format');
      }

      if (diff) {
        const response = await fetch(`/api/internal-fields/${catalogId}/${beforeUpdateField.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            diff,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to update internal field');
        }

        return response;
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['getInternalFields', catalogId]);
      },
    },
  );
};

export const useDeleteInternalField = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/internal-fields/${catalogId}/${fieldId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getInternalFields', catalogId] });
    },
  });
};
