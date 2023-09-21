import React, { useState } from 'react';
import { Button, TextField } from '@digdir/design-system-react';
import { useRouter } from 'next/router';
import { compare } from 'fast-json-patch';
import { emailRegex, localization, telephoneNumberRegex, textRegex } from '@catalog-frontend/utils';
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from 'apps/catalog-admin/hooks/users';
import { useAdminDispatch } from 'apps/catalog-admin/context/admin';
import { AssignedUser } from '@catalog-frontend/types';
import styles from './user-editor.module.css';

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

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(localization.alert.deleteUser)) {
      deleteUser.mutate(userId);
    }
  };

  let newUserTemplate: AssignedUser = {
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
      console.log('No changes detected.');
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
    updateUser;
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
    <div className={styles.codeListInfo}>
      <div className={styles.textField}>
        <TextField
          isValid={textRegex.test((findUserById(user?.id) || user)?.name || newUser.name)}
          label='Navn'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            type === 'create'
              ? setNewUser({ name: event.target.value, email: newUser.email, telephoneNumber: newUser.telephoneNumber })
              : updateUserState(user?.id, event.target.value);
          }}
          value={(findUserById(user?.id) || user)?.name}
        />
      </div>
      <div className={styles.textField}>
        <TextField
          isValid={emailRegex.test((findUserById(user?.id) || user)?.email || newUser.email)}
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
      <div className={styles.textField}>
        <TextField
          label='Telefonnummer'
          type='tel'
          inputMode='tel'
          isValid={telephoneNumberRegex.test(
            (findUserById(user?.id) || user)?.telephoneNumber || newUser.telephoneNumber,
          )}
          value={(findUserById(user?.id) || user)?.telephoneNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            type === 'create'
              ? setNewUser({ name: newUser.name, email: newUser.email, telephoneNumber: event.target.value })
              : updateUserState(user?.id, undefined, undefined, event.target.value);
          }}
        />
      </div>
      <div className={styles.formButtons}>
        <Button onClick={() => (type === 'create' ? handleCreateUser() : handleUpdateUser(user?.id))}>Lagre</Button>
        {type === 'create' ? (
          <Button
            color='danger'
            onClick={handleCancel}
          >
            Avbryt
          </Button>
        ) : (
          <Button
            color='danger'
            onClick={() => handleDeleteUser(user?.id)}
          >
            Slett
          </Button>
        )}
      </div>
    </div>
  );
};
