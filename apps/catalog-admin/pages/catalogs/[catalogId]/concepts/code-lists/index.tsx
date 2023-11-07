'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './code-lists.module.css';
import { Accordion, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { CodeList, Fields, Organization } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';
import { getFields, getOrganization } from '@catalog-frontend/data-access';
import CodeListEditor from '../../../../../components/code-list-editor';
import { PageLayout } from '../../../../../components/page-layout';
import { compare } from 'fast-json-patch';

const CodeListsPage = ({ organization, codeListsInUse }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showCodeListEditor, updatedCodeLists, updatedCodes } = adminContext;

  const [search, setSearch] = useState('');
  const [dirtyCodeLists, setDirtyCodeLists] = useState([]);

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = useMemo(() => getAllCodeLists?.codeLists || [], [getAllCodeLists]);

  const filteredCodeLists = () =>
    dbCodeLists.filter((codeList: CodeList) => codeList.name.toLowerCase().includes(search.toLowerCase()));

  useWarnIfUnsavedChanges(
    updatedCodeLists.some((codeList) => {
      const dbCodeList = dbCodeLists.find((list) => list.id === codeList.id);
      if (!dbCodeList) {
        return true;
      }
      return compare(dbCodeList, codeList).length > 0;
    }) || dirtyCodeLists.length > 0,
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <PageLayout>
        <div className={styles.row}>
          <SearchField
            ariaLabel='Søkefelt kodeliste'
            placeholder='Søk etter kodeliste...'
            onSearchSubmit={(search) => setSearch(search)}
          />
          <div className={styles.buttons}>
            <Button
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
        <div className='accordionStructure'>
          {showCodeListEditor && (
            <Accordion
              key={'codeList-create-edtior'}
              border={true}
              className='accordionWidth'
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
          {filteredCodeLists() &&
            filteredCodeLists()?.map((codeList: CodeList, index: number) => (
              <Accordion
                key={index}
                border={true}
                className='accordionWidth'
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <Heading size='xsmall'>{codeList.name}</Heading>
                    <p className={styles.description}> {codeList.description} </p>
                  </Accordion.Header>
                  <Accordion.Content>
                    <p className={styles.id}>ID: {codeList.id}</p>
                  </Accordion.Content>

                  <Accordion.Content>
                    <CodeListEditor
                      codeList={codeList}
                      codeListsInUse={codeListsInUse}
                      dirty={(dirty) =>
                        setDirtyCodeLists((prev) => {
                          if (dirty && !prev.includes(codeList.id)) {
                            return [...prev, codeList.id];
                          }
                          if (!dirty) {
                            return prev.filter((id) => id !== codeList.id);
                          }
                          return prev;
                        })
                      }
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
