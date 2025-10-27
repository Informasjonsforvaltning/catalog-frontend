import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetComments = ({ orgNumber, topicId }: any) => {
  return useQuery({
    queryKey: ['getComments', orgNumber, topicId],
    queryFn: async () => {
      if (!validOrganizationNumber(orgNumber)) {
        return Promise.reject('Invalid organization number');
      }

      if (!validUUID(topicId)) {
        return Promise.reject('Invalid topic id');
      }

      const response = await fetch(`/api/comments/${orgNumber}/${topicId}`, {
        method: 'GET',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response.json();
    },
  });
};

export const useCreateComment = ({ orgNumber, topicId }: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: string) => {
      if (!validOrganizationNumber(orgNumber)) {
        return Promise.reject('Invalid organization number');
      }

      if (!validUUID(topicId)) {
        return Promise.reject('Invalid topic id');
      }

      if (comment.length === 0) {
        return Promise.reject('Comment cannot be empty');
      }

      const response = await fetch(`/api/comments/${orgNumber}/${topicId}`, {
        method: 'POST',
        body: JSON.stringify({
          comment,
        }),
        cache: 'no-store',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};

export const useUpdateComment = ({ orgNumber, topicId }: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, comment }: { commentId: string; comment: string }) => {
      if (!validOrganizationNumber(orgNumber)) {
        return Promise.reject('Invalid organization number');
      }

      if (!validUUID(topicId)) {
        return Promise.reject('Invalid topic id');
      }

      if (!validUUID(commentId)) {
        return Promise.reject('Invalid comment id');
      }

      if (comment.length === 0) {
        return Promise.reject('Comment cannot be empty');
      }

      const response = await fetch(`/api/comments/${orgNumber}/${topicId}/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          comment,
        }),
        cache: 'no-store',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};

export const useDeleteComment = ({ orgNumber, topicId }: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!validOrganizationNumber(orgNumber)) {
        return Promise.reject('Invalid organization number');
      }

      if (!validUUID(topicId)) {
        return Promise.reject('Invalid topic id');
      }

      if (!validUUID(commentId)) {
        return Promise.reject('Invalid comment id');
      }

      const response = await fetch(`/api/comments/${orgNumber}/${topicId}/${commentId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      if (response.status === 401) {
        return Promise.reject('Unauthorized');
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};
