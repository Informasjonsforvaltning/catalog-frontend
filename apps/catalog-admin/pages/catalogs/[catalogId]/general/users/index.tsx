import React, { useState } from 'react';
import styles from './users.module.css';
import { Accordion, TextField, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { getTranslateText, localization, textRegex, telephoneNumberRegex, emailRegex } from '@catalog-frontend/utils';
import { useGetUsers, useCreateUser, useDeleteUser, useUpdateUser } from '../../../../../hooks/users';
import { useRouter } from 'next/router';
import { AssignedUser } from '@catalog-frontend/types';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';

export const CodeListsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;
  const createUser = useCreateUser(catalogId);
  const deleteUser = useDeleteUser(catalogId);
  const updateUser = useUpdateUser(catalogId);
  const [accordionIsOpen, setAccordionIsOpen] = useState(false);
  const nextUserNumber = (getUsers?.users?.length ?? 0) + 1;

  const newUser: AssignedUser = {
    name: 'Ny bruker ' + nextUserNumber,
    telephoneNumber: '',
    email: '',
  };

  const handleCreateUser = () => {
    createUser.mutate(newUser);
    setAccordionIsOpen(true);
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

  const findUserById = (userId: string) => updatedUserList.find((user) => user.id === userId);

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
      <Banner />
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
                <Accordion.Item
                  open={user.name.includes(`Ny bruker ${nextUserNumber - 1}`) ? accordionIsOpen : undefined}
                >
                  <Accordion.Header onClick={() => setAccordionIsOpen((prevState) => !prevState)}>
                    <h1 className={styles.label}>{user.name}</h1>
                  </Accordion.Header>
                  <Accordion.Content>
                    <div className={styles.codeListInfo}>
                      <div className={styles.textField}>
                        <TextField
                          isValid={textRegex.test((findUserById(user.id) || user)?.name)}
                          label='Navn'
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.id, event.target.value);
                          }}
                          value={(findUserById(user.id) || user)?.name}
                        />
                      </div>
                      <div className={styles.textField}>
                        <TextField
                          isValid={emailRegex.test((findUserById(user.id) || user)?.email)}
                          label='E-post'
                          inputMode='email'
                          value={(findUserById(user.id) || user)?.email}
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
                          isValid={telephoneNumberRegex.test((findUserById(user.id) || user)?.telephoneNumber)}
                          value={(findUserById(user.id) || user)?.telephoneNumber}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateUserState(user.id, undefined, undefined, event.target.value);
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

export async function getServerSideProps(props) {
  return serverSidePropsWithAdminPermissions(props);
}

export default CodeListsPage;
