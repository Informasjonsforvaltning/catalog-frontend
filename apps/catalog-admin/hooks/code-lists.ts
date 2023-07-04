import { CodeList } from '@catalog-frontend/types';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';

export const useGetAllCodeLists = ({ catalogId }) => {
  console.log(1);
  return useQuery({
    queryKey: ['getAllCodeLists', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/code-lists/${catalogId}`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};

export const useCreateCodeList = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codeList: CodeList) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      if (codeList.name.length === 0 || codeList.description.length === 0) {
        return Promise.reject('Code list must have name and description');
      }
      const response = await fetch(`/api/code-lists/${catalogId}`, {
        method: 'POST',
        body: JSON.stringify({
          codeList,
        }),
        cache: 'no-store',
      });
      console.log('create response', response);
      return response.json();
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getAllCodeLists', catalogId] });
    },
  });
};

export const useUpdateCodeList = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ oldCodeList, newCodeList }: { oldCodeList: CodeList; newCodeList: CodeList }) => {
      const diff = compare(oldCodeList, newCodeList);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (!validUUID(oldCodeList.id)) {
        throw new Error('Invalid code list id');
      }

      if (diff) {
        const response = await fetch(`/api/code-lists/${catalogId}/${oldCodeList.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            diff,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to update code list');
        }

        return response;
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        console.log('Success!!');
        queryClient.invalidateQueries(['getAllCodeLists', catalogId]);
      },
    },
  );
};

export const useDeleteCodeList = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codeListId: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/code-lists/${catalogId}/${codeListId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getAllCodeLists', catalogId] });
    },
  });
};
