import React, { useEffect, useRef, useState } from 'react';
import styles from './code-lists.module.css';
import { Accordion, TextField, Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, SearchField, UploadButton } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import {
  useCreateCodeList,
  useDeleteCodeList,
  useGetAllCodeLists,
  useUpdateCodeList,
} from '../../../../../hooks/code-lists';
import { CodeList } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeListEditor } from '../../../../../components/code-list-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';

const CodeListsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createCodeList = useCreateCodeList(catalogId);
  const deleteCodeList = useDeleteCodeList(catalogId);
  const updateCodeList = useUpdateCodeList(catalogId);
  const [accordionIsOpen, setAccordionIsOpen] = useState(false);
  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { updatedCodeLists } = adminContext;
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = getAllCodeLists?.codeLists || [];

  useEffect(() => {
    const filteredCodeLists = dbCodeLists.filter((codeList) =>
      codeList.name.toLowerCase().includes(search.toLowerCase()),
    );

    setSearchResults(filteredCodeLists);
  }, [dbCodeLists, search]);

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
      updateCodeList.mutate({ oldCodeList: dbCodeList, newCodeList: updatedCodeList });
    }
  };

  const handleCodeListUpdate = (codeListId: string, newName?: string, newDescription?: string) => {
    const indexInUpdatedCodeLists = updatedCodeLists.findIndex((code) => code.id === codeListId);

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

  const handleDeleteCodeList = (codeListId, event) => {
    if (window.confirm(localization.codeList.confirmDelete)) {
      deleteCodeList.mutate(codeListId);
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
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
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
      <Banner />
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
                    open={
                      codeList.name.includes(`Ny kodeliste ${getNextNewCodeListNumber(dbCodeLists) - 1}`)
                        ? accordionIsOpen
                        : undefined
                    }
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

                      <CodeListEditor dbCodeList={codeList} />
                      <div className={styles.formButtons}>
                        <Button onClick={() => handleUpdateDbCodeList(codeList.id)}>{localization.saveEdits}</Button>
                        <Button
                          onClick={(e) => handleDeleteCodeList(codeList.id, e)}
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

export default CodeListsPage;
