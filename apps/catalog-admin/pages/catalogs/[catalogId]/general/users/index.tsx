import React, { useEffect, useState } from 'react';
import { Accordion, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useGetUsers } from '../../../../../hooks/users';
import { useRouter } from 'next/router';
import { AssignedUser, Organization } from '@catalog-frontend/types';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import { UserEditor } from '../../../../../components/user-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';

import styles from './users.module.css';

export const CodeListsPage = ({ organization }) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}` ?? '';

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
          text: getTranslateText(localization.catalogAdmin.userList),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />
      <div className={styles.center}>
        <div className={styles.page}>
          <div className={styles.row}>
            <SearchField
              ariaLabel=''
              placeholder='Søk etter bruker...'
              onSearchSubmit={(search) => setSearch(search)}
            />
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

          <Heading
            level={2}
            size='xsmall'
          >
            Brukerliste
          </Heading>
          {showUserEditor && (
            <Accordion
              key={'create-editor'}
              border={true}
              className={styles.accordion}
            >
              <Accordion.Item defaultOpen={showUserEditor}>
                <Accordion.Header>
                  <Heading
                    size='xsmall'
                    className={styles.label}
                    level={3}
                  ></Heading>
                </Accordion.Header>
                <Accordion.Content>
                  <UserEditor type={'create'} />
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
                className={styles.accordion}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <Heading size='xsmall'>{user.name}</Heading>
                  </Accordion.Header>
                  <Accordion.Content>
                    <UserEditor user={user} />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  return serverSidePropsWithAdminPermissions({ req, res, params }, async () => {
    const { catalogId } = params;

    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return {
      organization,
    };
  });
}

export default CodeListsPage;
