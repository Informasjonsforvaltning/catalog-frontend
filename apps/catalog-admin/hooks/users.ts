import { AssignedUser } from '@catalog-frontend/types';
import { validOrganizationNumber, validUUID, textRegex, emailRegex } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';

export const useGetUsers = (catalogId: string) => {
  return useQuery({
    queryKey: ['getUsers', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/users/${catalogId}`, {
        method: 'GET',
      });
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: AssignedUser) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      if (user?.name?.length === 0) {
        return Promise.reject('User must have a name');
      }
      const response = await fetch(`/api/users/${catalogId}`, {
        method: 'POST',
        body: JSON.stringify({
          user,
        }),
        cache: 'no-store',
      });
      return response;
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUsers', catalogId] });
    },
  });
};

export const useUpdateUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      beforeUpdateUser,
      updatedUser,
    }: {
      beforeUpdateUser: AssignedUser;
      updatedUser: AssignedUser;
    }) => {
      const diff = compare(beforeUpdateUser, updatedUser);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (!validUUID(beforeUpdateUser.id)) {
        throw new Error('Invalid user id');
      }

      if (updatedUser.name && !textRegex.test(updatedUser.name)) {
        throw new Error('Invalid name');
      }

      if (updatedUser.email && !emailRegex.test(updatedUser.email)) {
        throw new Error('Invalid email');
      }

      if (diff) {
        const response = await fetch(`/api/users/${catalogId}/${beforeUpdateUser.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            diff,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        return response;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUsers', catalogId] });
    },
  });
};

export const useDeleteUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/users/${catalogId}/${userId}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUsers', catalogId] });
    },
  });
};
