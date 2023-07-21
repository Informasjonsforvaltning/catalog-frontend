import { User } from '@catalog-frontend/types';
import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { compare } from 'fast-json-patch';

export const useGetUsers = (catalogId: string) => {
  return useQuery({
    queryKey: ['getUsers', catalogId],

    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/user-list/${catalogId}`, {
        method: 'GET',
      });
      return response.json();
    },
  });
};

export const useCreateUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: User) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      if (user.name.length === 0) {
        return Promise.reject('User must have a name');
      }
      const response = await fetch(`/api/user-list/${catalogId}`, {
        method: 'POST',
        body: JSON.stringify({
          user,
        }),
        cache: 'no-store',
      });
      return response.json();
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUsers', catalogId] });
    },
  });
};

export const useUpdateUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ beforeUpdateUser, updatedUser }: { beforeUpdateUser: User; updatedUser: User }) => {
      const diff = compare(beforeUpdateUser, updatedUser);

      if (!validOrganizationNumber(catalogId)) {
        throw new Error('Invalid organization number');
      }

      if (!validUUID(beforeUpdateUser.userId)) {
        throw new Error('Invalid user id');
      }

      const nameRegex =
        /^[a-zA-ZàáâäãåąčćęèéêëėæįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const telephoneNumberRegex = /^\+?[1-9][0-9]{7,14}$/;

      if (!nameRegex.test(updatedUser.name)) {
        throw new Error('Invalid name');
      }

      if (!emailRegex.test(updatedUser.email)) {
        throw new Error('Invalid email');
      }

      if (!telephoneNumberRegex.test(String(updatedUser.telephoneNumber))) {
        throw new Error('Invalid telephone number');
      }

      if (diff) {
        const response = await fetch(`/api/user-list/${catalogId}/${beforeUpdateUser.userId}`, {
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
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['getUsers', catalogId]);
      },
    },
  );
};

export const useDeleteUser = (catalogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid organization number');
      }

      const response = await fetch(`/api/user-list/${catalogId}/${userId}`, {
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
