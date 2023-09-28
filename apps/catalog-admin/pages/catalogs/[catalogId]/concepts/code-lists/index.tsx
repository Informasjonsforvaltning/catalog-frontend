import React, { useEffect, useState } from 'react';
import styles from './code-lists.module.css';
import sharedStyles from '../../../../shared-style.module.css';
import { Accordion, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { CodeList, Fields, Organization } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';
import { getFields, getOrganization } from '@catalog-frontend/data-access';
import CodeListEditor from '../../../../../components/code-list-editor';

const CodeListsPage = ({ organization, codeListsInUse }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showCodeListEditor, updatedCodes } = adminContext;

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = getAllCodeLists?.codeLists || [];

  useEffect(() => {
    const filteredCodeLists = dbCodeLists.filter((codeList: CodeList) =>
      codeList.name.toLowerCase().includes(search.toLowerCase()),
    );

    setSearchResults(filteredCodeLists);
  }, [getAllCodeLists, search]);

  useEffect(() => {
    // Adds a copy of the codes in context
    const updatedCodesAccumulator = { ...updatedCodes };

    dbCodeLists.forEach((codeList: CodeList) => {
      updatedCodesAccumulator[codeList.id] = codeList?.codes;
    });

    adminDispatch({
      type: 'SET_UPDATED_CODES',
      payload: { updatedCodes: updatedCodesAccumulator },
    });
  }, [dbCodeLists]);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.manage.catalogAdmin),
        },
        {
          href: `/catalogs/${catalogId}/concepts`,
          text: getTranslateText(localization.catalogType.concept),
        },
        {
          href: `/catalogs/${catalogId}/concepts/code-lists`,
          text: getTranslateText(localization.catalogAdmin.codeLists),
        },
      ] as BreadcrumbType[])
    : [];

  const handleCreateCodeList = () => {
    adminDispatch({ type: 'SET_SHOW_CODE_LIST_EDITOR', payload: { showCodeListEditor: true } });
    adminDispatch({
      type: 'SET_UPDATED_CODES',
      payload: { updatedCodes: { ...updatedCodes, ['0']: [] } },
    });
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />
      <div className={sharedStyles.center}>
        <div className={sharedStyles.pageContent}>
          <div className={styles.row}>
            <SearchField
              ariaLabel={'Søkefelt kodeliste'}
              placeholder='Søk etter kodeliste...'
              onSearchSubmit={(search) => setSearch(search)}
            />
            <div className={styles.buttons}>
              <Button
                className={styles.createButton}
                icon={<PlusCircleIcon />}
                onClick={handleCreateCodeList}
              >
                {localization.catalogAdmin.createCodeList}
              </Button>
            </div>
          </div>
          <Heading
            level={2}
            size='xsmall'
          >
            {localization.catalogAdmin.codeLists}
          </Heading>
          <div className={styles.content}>
            {showCodeListEditor && (
              <Accordion
                key={'codeList-create-edtior'}
                border={true}
                className={sharedStyles.accordionSpacing}
              >
                <Accordion.Item defaultOpen={showCodeListEditor}>
                  <Accordion.Header>
                    <Heading size='small'></Heading>
                  </Accordion.Header>

                  <Accordion.Content>
                    <CodeListEditor type='create' />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            )}
            {searchResults &&
              searchResults?.map((codeList: CodeList, index: number) => (
                <Accordion
                  key={index}
                  border={true}
                  className={styles.accordionSpacing}
                >
                  <Accordion.Item>
                    <Accordion.Header>
                      <Heading
                        size='xsmall'
                        className={styles.label}
                      >
                        {codeList.name}
                      </Heading>
                      <p className={styles.description}> {codeList.description} </p>
                    </Accordion.Header>
                    <Accordion.Content>
                      <p className={styles.id}>ID: {codeList.id}</p>
                    </Accordion.Content>

                    <Accordion.Content>
                      <CodeListEditor
                        codeList={codeList}
                        codeListsInUse={codeListsInUse}
                      />
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  return serverSidePropsWithAdminPermissions({ req, res, params }, async (token) => {
    const { catalogId } = params;

    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    const { internal, editable }: Fields = await getFields(catalogId, token.accessToken).then((res) => res.json());

    const codeListsInUse = [];

    internal.forEach((field) => {
      if (field.codeListId !== null) {
        codeListsInUse.push(field.codeListId);
      }
    });

    if (editable?.domainCodeListId !== null) {
      codeListsInUse.push(editable.domainCodeListId);
    }

    return {
      organization,
      codeListsInUse,
    };
  });
}

export default CodeListsPage;
