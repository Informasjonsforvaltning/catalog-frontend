import { useMutation, useQuery, useQueryClient } from 'react-query';

export const useGetComments = ({ orgNumber, topicId }) => {
  return useQuery({
    queryKey: ['getComments', orgNumber, topicId],
    queryFn: async () => {
      const response = await fetch(`/api/comments/${orgNumber}/${topicId}`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};

export const useCreateComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: string) => {
      const response = await fetch(`/api/comments/${orgNumber}/${topicId}`, {
        method: 'POST',
        body: JSON.stringify({
          comment,
        }),
        cache: 'no-store',
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};

export const useUpdateComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, comment }: { commentId: string; comment: string }) => {
      const response = await fetch(`/api/comments/${orgNumber}/${topicId}/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          comment,
        }),
        cache: 'no-store',
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};

export const useDeleteComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${orgNumber}/${topicId}/${commentId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] });
    },
  });
};
