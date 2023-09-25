import React, { useEffect, useRef, useState } from 'react';
import styles from './code-lists.module.css';
import { Accordion, TextField, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import {
  useCreateCodeList,
  useDeleteCodeList,
  useGetAllCodeLists,
  useUpdateCodeList,
} from '../../../../../hooks/code-lists';
import { CodeList, Fields, Organization } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeListEditor } from '../../../../../components/code-list-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';
import { getFields, getOrganization } from '@catalog-frontend/data-access';

const CodeListsPage = ({ organization, codeListsInUse }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createCodeList = useCreateCodeList(catalogId);
  const deleteCodeList = useDeleteCodeList(catalogId);
  const updateCodeList = useUpdateCodeList(catalogId);
  const [accordionIsOpen, setAccordionIsOpen] = useState(false);
  const adminDispatch = useAdminDispatch();
  const { updatedCodeLists } = useAdminState();
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

  const newCodeList = {
    name: 'Ny kodeliste ' + getNextNewCodeListNumber(dbCodeLists),
    description: '',
    codes: [],
  };

  const newAccordionRef = useRef(null);

  const handleCreateCodeList = () => {
    createCodeList.mutate(newCodeList, {
      onSuccess: () => {
        setAccordionIsOpen(true);
        newAccordionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      },
    });
  };

  const handleUpdateDbCodeList = (codeListId: string) => {
    const updatedCodeList = updatedCodeLists.find((codeList) => codeList.id === codeListId);
    const dbCodeList = dbCodeLists.find((codeList) => codeList.id === codeListId);
    const diff = compare(dbCodeList, updatedCodeList);

    if (diff) {
      updateCodeList
        .mutateAsync({ oldCodeList: dbCodeList, newCodeList: updatedCodeList })
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

  const handleCodeListUpdate = (codeListId: string, newName?: string, newDescription?: string) => {
    const indexInUpdatedCodeLists = updatedCodeLists.findIndex((codeList) => codeList.id === codeListId);

    if (indexInUpdatedCodeLists !== -1) {
      const codeListToUpdate = updatedCodeLists[indexInUpdatedCodeLists];

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description: newDescription !== undefined ? newDescription : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [...updatedCodeLists];
        updatedCodeListsCopy[indexInUpdatedCodeLists] = updatedCodeList;

        adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
      }
    } else {
      const codeListToUpdate = dbCodeLists.find((codeList) => codeList.id === codeListId);

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description: newDescription !== undefined ? newDescription : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [...updatedCodeLists, updatedCodeList];
        adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
      }
    }
  };

  const handleDeleteCodeList = (codeListId: string) => {
    if (!codeListsInUse.includes(codeListId)) {
      if (window.confirm(localization.codeList.confirmDelete)) {
        deleteCodeList.mutate(codeListId);
      }
    } else {
      window.alert('Kan ikke slette en kodeliste som er i bruk');
    }
  };

  function getNextNewCodeListNumber(codeLists: CodeList[]): number {
    const lenght = codeLists ? codeLists?.length : 0;
    return lenght + 1;
  }

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

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />
      <div className={styles.center}>
        <div className={styles.page}>
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
            {searchResults &&
              searchResults?.map((codeList: CodeList, index: number) => (
                <Accordion
                  key={index}
                  border={true}
                  className={styles.accordion}
                >
                  <Accordion.Item
                    ref={newAccordionRef}
                    defaultOpen={index === searchResults.length - 1 ? accordionIsOpen : false}
                  >
                    <Accordion.Header onClick={() => setAccordionIsOpen((prevState) => !prevState)}>
                      <h1 className={styles.label}>{codeList.name}</h1>
                      <p className={styles.description}> {codeList.description} </p>
                    </Accordion.Header>
                    <Accordion.Content>
                      <p className={styles.id}>ID: {codeList.id}</p>
                    </Accordion.Content>

                    <Accordion.Content>
                      <div className={styles.codeListInfo}>
                        <div className={styles.textField}>
                          <TextField
                            label={localization.name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleCodeListUpdate(codeList.id, event.target.value, undefined);
                            }}
                            value={(updatedCodeLists.find((c) => c.id === codeList.id) || codeList)?.name}
                          />
                        </div>
                        <div className={styles.textField}>
                          <TextField
                            label={localization.description}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleCodeListUpdate(codeList.id, undefined, event.target.value);
                            }}
                            value={(updatedCodeLists.find((c) => c.id === codeList.id) || codeList)?.description}
                          />
                        </div>
                      </div>

                      <CodeListEditor codeList={codeList} />
                      <div className={styles.formButtons}>
                        <Button onClick={() => handleUpdateDbCodeList(codeList.id)}>{localization.saveEdits}</Button>
                        <Button
                          onClick={() => handleDeleteCodeList(codeList.id)}
                          color='danger'
                        >
                          {localization.catalogAdmin.deleteCodeList}
                        </Button>
                      </div>
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
