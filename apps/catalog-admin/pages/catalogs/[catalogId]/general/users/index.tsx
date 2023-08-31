import React, { useState } from 'react';
import styles from './users.module.css';
import { Accordion, TextField, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, PageBanner, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useGetUsers, useCreateUser, useDeleteUser, useUpdateUser } from '../../../../../hooks/users';
import { useRouter } from 'next/router';
import { AssignedUser } from '@catalog-frontend/types';
import { compare } from 'fast-json-patch';
import { textRegex, telephoneNumberRegex, emailRegex } from '@catalog-frontend/utils';

export const CodeListsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;
  const createUser = useCreateUser(catalogId);
  const deleteUser = useDeleteUser(catalogId);
  const updateUser = useUpdateUser(catalogId);

  const newUser: AssignedUser = {
    name: 'Ny bruker ' + getNextUserNumber(getUsers?.users),
  };

  function getNextUserNumber(users: AssignedUser[]): number {
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

  const [updatedUserList, setUpdatedUserList] = useState<AssignedUser[]>([]);

  const handleUpdateUser = (userId: string) => {
    const updatedUser = updatedUserList.find((user) => user.id === userId);
    const dbUser: AssignedUser = getUsers.users.find((user) => user.id === userId);
    const diff = dbUser && updatedUser ? compare(dbUser, updatedUser) : null;

    if (diff) {
      updateUser.mutate({ beforeUpdateUser: dbUser, updatedUser: updatedUser });
    }
  };

  const updateUserState = (userId: string, newName?: string, newEmail?: string, newTelephoneNumber?: number) => {
    const updatedUserListIndex = updatedUserList.findIndex((user) => user.id === userId);
    const userToUpdate =
      updatedUserListIndex !== -1 ? updatedUserList[updatedUserListIndex] : dbUsers.find((user) => user.id === userId);
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

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
        {
          href: `/catalogs/${catalogId}/general/users`,
          text: getTranslateText(localization.catalogAdmin.userList),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
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
            dbUsers.map((user: AssignedUser, index) => (
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
                          isValid={textRegex.test((updatedUserList.find((c) => c.id === user.id) || user)?.name)}
                          label='Navn'
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.id, event.target.value);
                          }}
                          value={(updatedUserList.find((c) => c.id === user.id) || user)?.name}
                        />
                      </div>
                      <div className={styles.textField}>
                        <TextField
                          isValid={emailRegex.test((updatedUserList.find((c) => c.id === user.id) || user)?.email)}
                          label='E-post'
                          inputMode='email'
                          value={(updatedUserList.find((c) => c.id === user.id) || user)?.email}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.id, undefined, event.target.value, undefined);
                          }}
                        />
                      </div>
                      <div className={styles.textField}>
                        <TextField
                          label='Telefonnummer'
                          type='tel'
                          inputMode='tel'
                          isValid={telephoneNumberRegex.test(
                            String((updatedUserList.find((c) => c.id === user.id) || user)?.telephoneNumber),
                          )}
                          value={String((updatedUserList.find((c) => c.id === user.id) || user)?.telephoneNumber)}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.id, undefined, undefined, Number(event.target.value));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formButtons}>
                      <Button onClick={() => handleUpdateUser(user.id)}>Lagre</Button>
                      <Button
                        color='danger'
                        onClick={() => handleDeleteUser(user.id)}
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
