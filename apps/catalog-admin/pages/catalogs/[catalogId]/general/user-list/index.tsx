import React, { useState } from 'react';
import styles from './user-list.module.css';
import { Accordion, TextField, Heading } from '@digdir/design-system-react';
import { Button, PageBanner, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import { useGetUsers, useCreateUser, useDeleteUser, useUpdateUser } from '../../../../../hooks/user-list';
import { useRouter } from 'next/router';
import { User } from '@catalog-frontend/types';
import { compare } from 'fast-json-patch';

export const CodeListsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;
  const createUser = useCreateUser(catalogId);
  const deleteUser = useDeleteUser(catalogId);
  const updateUser = useUpdateUser(catalogId);

  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėæįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  const emailRegex = /^[\w-]+@[\w-]+\.[\w-]{2,4}$/;
  const telephoneNumberRegex = /^\+?[1-9][0-9]{7,14}$/;

  const newUser: User = {
    name: 'Ny bruker ' + getNextUserNumber(getUsers?.users),
  };

  function getNextUserNumber(users: User[]): number {
    const lenght = users ? users?.length : 0;
    return lenght + 1;
  }

  const handleCreateUser = () => {
    createUser.mutate(newUser);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Er du sikker på at du vil slette denne brukeren?')) {
      deleteUser.mutate(userId);
    }
  };

  const [updatedUserList, setUpdatedUserList] = useState<User[]>([]);

  const handleUpdateUser = (userId: string) => {
    const updatedUser = updatedUserList.find((user) => user.userId === userId);
    const dbUser: User = getUsers.users.find((user) => user.userId === userId);
    const diff = dbUser && updatedUser ? compare(dbUser, updatedUser) : null;

    if (diff) {
      updateUser.mutate({ beforeUpdateUser: dbUser, updatedUser: updatedUser });
    }
  };

  const updateUserState = (userId: string, newName?: string, newEmail?: string, newTelephoneNumber?: number) => {
    const updatedUserListIndex = updatedUserList.findIndex((user) => user.userId === userId);
    const userToUpdate =
      updatedUserListIndex !== -1
        ? updatedUserList[updatedUserListIndex]
        : dbUsers.find((user) => user.userId === userId);
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

  return (
    <>
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={'Skatteetaten'}
      />
      <div className={styles.center}>
        <div className={styles.page}>
          <div className={styles.row}>
            <SearchField
              ariaLabel={''}
              placeholder='Søk etter bruker...'
            />
            <div className={styles.buttons}>
              <div className={styles.buttons}>
                <Button
                  className={styles.createButton}
                  icon={<PlusCircleIcon />}
                  onClick={handleCreateUser}
                >
                  {localization.catalogAdmin.addUser}
                </Button>
              </div>
            </div>
          </div>

          <Heading
            level={2}
            size='xsmall'
          >
            Brukerliste
          </Heading>
          {dbUsers &&
            dbUsers.map((user: User, index) => (
              <Accordion
                key={index}
                border={true}
                className={styles.accordion}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <h1 className={styles.label}>{user.name}</h1>
                  </Accordion.Header>
                  <Accordion.Content>
                    <div className={styles.codeListInfo}>
                      <div className={styles.textField}>
                        <TextField
                          isValid={nameRegex.test(
                            (updatedUserList.find((c) => c.userId === user.userId) || user)?.name,
                          )}
                          label='Navn'
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.userId, event.target.value);
                          }}
                          value={(updatedUserList.find((c) => c.userId === user.userId) || user)?.name}
                        />
                      </div>
                      <div className={styles.textField}>
                        <TextField
                          isValid={emailRegex.test(
                            (updatedUserList.find((c) => c.userId === user.userId) || user)?.email,
                          )}
                          label='E-post'
                          inputMode='email'
                          value={(updatedUserList.find((c) => c.userId === user.userId) || user)?.email}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.userId, undefined, event.target.value, undefined);
                          }}
                        />
                      </div>
                      <div className={styles.textField}>
                        <TextField
                          label='Telefonnummer'
                          type='tel'
                          inputMode='tel'
                          isValid={telephoneNumberRegex.test(
                            String((updatedUserList.find((c) => c.userId === user.userId) || user)?.telephoneNumber),
                          )}
                          value={String(
                            (updatedUserList.find((c) => c.userId === user.userId) || user)?.telephoneNumber,
                          )}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.userId, undefined, undefined, Number(event.target.value));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formButtons}>
                      <Button onClick={() => handleUpdateUser(user.userId)}>Lagre</Button>
                      <Button
                        color='danger'
                        onClick={() => handleDeleteUser(user.userId)}
                      >
                        Slett
                      </Button>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </div>
    </>
  );
};

export default CodeListsPage;
