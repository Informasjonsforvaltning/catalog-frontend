import { EditableFields, InternalField } from '@catalog-frontend/types';
import { getTranslateText, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';
import { textRegexWithNumbers } from '@catalog-frontend/utils';

const validateLabelField = (label: string) => {
  return textRegexWithNumbers.test(label);
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
    mutationFn: async (field: InternalField) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      if (!field.label) {
        return Promise.reject('Internal field must have a label');
      }

      if (!validateLabelField(String(getTranslateText(field.label)))) {
        return Promise.reject('Internal field label must have correct format');
      }

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
    async ({ beforeUpdateField, updatedField }: { beforeUpdateField: InternalField; updatedField: InternalField }) => {
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

export const useUpdateEditableFields = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ beforeUpdate, afterUpdate }: { beforeUpdate: EditableFields; afterUpdate: EditableFields }) => {
      const diff = compare(beforeUpdate, afterUpdate);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (diff) {
        const response = await fetch(`/api/editable-fields/${catalogId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            diff,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to upddate editable field');
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
