import React, { useState } from 'react';
import { Button, Textfield } from '@digdir/design-system-react';
import { useRouter } from 'next/router';
import { compare } from 'fast-json-patch';
import { emailRegex, localization, telephoneNumberRegex, textRegex } from '@catalog-frontend/utils';
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from '../../hooks/users';
import { useAdminDispatch } from '../../context/admin';
import { AssignedUser } from '@catalog-frontend/types';

type EditorType = 'create' | 'update';

interface UserEditorProps {
  user?: AssignedUser;
  type?: EditorType;
}

export const UserEditor = ({ user, type }: UserEditorProps) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;

  const deleteUser = useDeleteUser(catalogId);
  const updateUser = useUpdateUser(catalogId);
  const createUser = useCreateUser(catalogId);

  const adminDispatch = useAdminDispatch();

  const findUserById = (userId: string) => updatedUserList.find((user) => user?.id === userId);

  const handleDeleteUser = (user: AssignedUser) => {
    if (window.confirm(`${localization.alert.deleteUser} ${user?.name}`)) {
      deleteUser.mutate(user?.id);
    }
  };

  const newUserTemplate: AssignedUser = {
    name: '',
    telephoneNumber: '',
    email: '',
  };

  const handleCancel = () => {
    adminDispatch({ type: 'SET_SHOW_USER_EDITOR', payload: { showUserEditor: false } });
  };

  const [updatedUserList, setUpdatedUserList] = useState<AssignedUser[]>([]);
  const [newUser, setNewUser] = useState<AssignedUser>(newUserTemplate);

  const handleUpdateUser = (userId: string) => {
    const updatedUser = updatedUserList.find((user) => user?.id === userId);
    const dbUser: AssignedUser = getUsers.users.find((user: AssignedUser) => user?.id === userId);
    const diff = dbUser && updatedUser ? compare(dbUser, updatedUser) : null;

    if (diff) {
      updateUser
        .mutateAsync({ beforeUpdateUser: dbUser, updatedUser: updatedUser })
        .then(() => {
          alert(localization.alert.success);
        })
        .catch(() => {
          alert(localization.alert.fail);
        });
    } else {
      alert(localization.alert.noChanges);
    }
  };

  const updateUserState = (userId: string, newName?: string, newEmail?: string, newTelephoneNumber?: string) => {
    const updatedUserListIndex = updatedUserList.findIndex((user) => user?.id === userId);
    const userToUpdate =
      updatedUserListIndex !== -1 ? updatedUserList[updatedUserListIndex] : dbUsers.find((user) => user?.id === userId);
    const updatedUserListsCopy = [...updatedUserList];

    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        name: newName !== undefined ? newName : userToUpdate.name,
        email: newEmail !== undefined ? newEmail : userToUpdate.email,
        telephoneNumber: newTelephoneNumber !== undefined ? newTelephoneNumber : userToUpdate.telephoneNumber,
      };
      if (updatedUserListIndex !== -1) {
        updatedUserListsCopy[updatedUserListIndex] = updatedUser;
      } else {
        updatedUserListsCopy.push(updatedUser);
      }
      setUpdatedUserList(updatedUserListsCopy);
    }
  };

  const handleCreateUser = () => {
    createUser
      .mutateAsync(newUser)
      .then(() => {
        alert(localization.alert.success);
      })
      .catch(() => {
        alert(localization.alert.fail);
      });
    handleCancel();
  };

  return (
    <div className='editorStructure'>
      <div className='editorSpacing'>
        <Textfield
          error={
            textRegex.test((findUserById(user?.id) || user)?.name || newUser.name)
              ? null
              : localization.validation.invalidValue
          }
          label='Navn'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            type === 'create'
              ? setNewUser({ name: event.target.value, email: newUser.email, telephoneNumber: newUser.telephoneNumber })
              : updateUserState(user?.id, event.target.value);
          }}
          value={(findUserById(user?.id) || user)?.name}
        />
      </div>
      <div className='editorSpacing'>
        <Textfield
          error={
            emailRegex.test((findUserById(user?.id) || user)?.email || newUser.email)
              ? null
              : localization.validation.invalidValue
          }
          label='E-post'
          inputMode='email'
          value={(findUserById(user?.id) || user)?.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            type === 'create'
              ? setNewUser({ name: newUser.name, email: event.target.value, telephoneNumber: newUser.telephoneNumber })
              : updateUserState(user?.id, undefined, event.target.value, undefined);
          }}
        />
      </div>
      <div className='editorButtons'>
        <Button onClick={() => (type === 'create' ? handleCreateUser() : handleUpdateUser(user?.id))}>Lagre</Button>
        {type === 'create' ? (
          <Button
            color='danger'
            onClick={handleCancel}
          >
            {localization.button.cancel}
          </Button>
        ) : (
          <Button
            color='danger'
            onClick={() => handleDeleteUser(user)}
          >
            {localization.button.delete}
          </Button>
        )}
      </div>
    </div>
  );
};
