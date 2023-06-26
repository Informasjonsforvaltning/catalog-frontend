import { CodeList } from '@catalog-frontend/types';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllCodeLists = ({ catalogId }) => {
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
      return response.json();
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getAllCodeLists', catalogId] });
    },
  });
};

// export const useUpdateComment = ({ orgNumber, topicId }) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ commentId, comment }: { commentId: string; comment: string }) => {
//       if (!validOrganizationNumber(orgNumber)) {
//         return Promise.reject('Invalid organization number');
//       }

//       if (!validUUID(topicId)) {
//         return Promise.reject('Invalid topic id');
//       }

//       if (!validUUID(commentId)) {
//         return Promise.reject('Invalid comment id');
//       }

//       if (comment.length === 0) {
//         return Promise.reject('Comment cannot be empty');
//       }

//       const response = await fetch(`/api/comments/${orgNumber}/${topicId}/${commentId}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           comment,
//         }),
//         cache: 'no-store',
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
//     },
//   });
// };

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
