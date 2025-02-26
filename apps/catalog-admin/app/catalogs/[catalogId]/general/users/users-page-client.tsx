'use client';

import React, { useEffect, useState } from 'react';
import { Accordion, Heading } from '@digdir/designsystemet-react';
import { Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import { useGetUsers } from '../../../../../hooks/users';
import { AssignedUser } from '@catalog-frontend/types';
import { UserEditor } from '../../../../../components/user-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';

import styles from './users.module.css';
import { PageLayout } from '../../../../../components/page-layout';

export interface UsersPageClientProps {
  catalogId: string;
}

export const UsersPageClient = ({ catalogId }: UsersPageClientProps) => {
  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showUserEditor } = adminContext;

  useEffect(() => {
    const filteredCodeLists = dbUsers?.filter((user: AssignedUser) =>
      user.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setSearchResults(filteredCodeLists);
  }, [dbUsers, search]);

  const handleCreateUser = () => {
    adminDispatch({ type: 'SET_SHOW_USER_EDITOR', payload: { showUserEditor: true } });
  };

  return (
    <>
      <PageLayout>
        <div className={styles.row}>
          <SearchField
            ariaLabel={localization.search.searchForUsername}
            placeholder={localization.search.searchForUsername}
            onSearchSubmit={(search) => setSearch(search)}
          />
          <div className='editorButtons'>
            <Button
              className={styles.createButton}
              onClick={handleCreateUser}
            >
              <>
                <PlusCircleIcon />
                {localization.catalogAdmin.addUser}
              </>
            </Button>
          </div>
        </div>

        <Heading
          level={2}
          size='xsmall'
        >
          {localization.catalogAdmin.username}
        </Heading>

        <div className='accordionStructure'>
          {showUserEditor && (
            <Accordion
              key={'create-editor'}
              border={true}
              className='accordionWidth'
            >
              <Accordion.Item defaultOpen={showUserEditor}>
                <Accordion.Header>
                  <Heading
                    size='xsmall'
                    level={3}
                  ></Heading>
                </Accordion.Header>
                <Accordion.Content>
                  <UserEditor
                    type={'create'}
                    catalogId={catalogId}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          )}

          {searchResults?.length < 1 && <Heading size='medium'>{localization.search.noHits}</Heading>}
          {searchResults &&
            searchResults.map((user: AssignedUser, index: number) => (
              <Accordion
                key={index}
                border={true}
                className='accordionWidth'
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <Heading size='xsmall'>{user.name}</Heading>
                  </Accordion.Header>
                  <Accordion.Content>
                    <UserEditor
                      user={user}
                      catalogId={catalogId}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </PageLayout>
    </>
  );
};

export default UsersPageClient;
