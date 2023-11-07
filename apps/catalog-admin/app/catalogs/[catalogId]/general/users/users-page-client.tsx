'use client';

import React, { useEffect, useState } from 'react';
import { Accordion, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useGetUsers } from '../../../../../hooks/users';
import { AssignedUser } from '@catalog-frontend/types';
import { Banner } from '../../../../../components/banner';
import { UserEditor } from '../../../../../components/user-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';

import styles from './users.module.css';
import { PageLayout } from '../../../../../components/page-layout';

export const UsersPageClient = ({ catalogId, organization }) => {
  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showUserEditor } = adminContext;

  useEffect(() => {
    const filteredCodeLists = dbUsers?.filter((user: AssignedUser) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
    setSearchResults(filteredCodeLists);
  }, [dbUsers, search]);

  const handleCreateUser = () => {
    adminDispatch({ type: 'SET_SHOW_USER_EDITOR', payload: { showUserEditor: true } });
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
        {
          href: `/catalogs/${catalogId}/general/users`,
          text: getTranslateText(localization.catalogAdmin.usernameList),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />

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
              icon={<PlusCircleIcon />}
              onClick={handleCreateUser}
            >
              {localization.catalogAdmin.addUser}
            </Button>
          </div>
        </div>

        <Heading
          level={2}
          size='xsmall'
        >
          {localization.catalogAdmin.usernameList}
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
