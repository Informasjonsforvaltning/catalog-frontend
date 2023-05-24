import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetComments = ({ orgNumber, topicId }) => {
    return useQuery({
      queryKey: ['getComments', orgNumber, topicId],
      queryFn: async () => {
        const response = await fetch(`/api/comments?${new URLSearchParams({
          orgNumber,
          topicId
        })}`, {
          method: 'GET' 
        });
        return response.json();
      },
    });
};

export const useCreateComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: string) => {
      const response = await fetch(`/api/comments?${new URLSearchParams({
        orgNumber,
        topicId
      })}`, {
        method: 'POST',
        body: JSON.stringify({
          comment
        }),
        cache: 'no-store'
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] })
    },
  });

};

export const useUpdateComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, comment }: { commentId: string, comment: string }) => {
      const response = await fetch(`/api/comments?${new URLSearchParams({
        orgNumber,
        topicId
      })}`, {
        method: 'PUT',
        body: JSON.stringify({
          commentId,
          comment
        }),
        cache: 'no-store'
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] })
    },
  });
};

export const useDeleteComment = ({ orgNumber, topicId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments?${new URLSearchParams({
        orgNumber,
        topicId
      })}`, {
        method: 'DELETE',
        body: JSON.stringify({
          commentId
        }),
        cache: 'no-store'
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getComments', orgNumber, topicId] })
    },
  });
};
