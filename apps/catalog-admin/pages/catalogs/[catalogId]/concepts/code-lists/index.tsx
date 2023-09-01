import React, { useRef, useState } from 'react';
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

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });

  const newCodeList = {
    name: 'Ny kodeliste ' + getNextNewCodeListNumber(getAllCodeLists?.codeLists),
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
    const dbCodeList = getAllCodeLists.codeLists.find((codeList) => codeList.id === codeListId);
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
      const codeListToUpdate = getAllCodeLists.codeLists.find((codeList) => codeList.id === codeListId);

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
            />
            <div className={styles.buttons}>
              <div className={styles.buttons}>
                <Button
                  className={styles.createButton}
                  icon={<PlusCircleIcon />}
                  onClick={handleCreateCodeList}
                >
                  {localization.catalogAdmin.createCodeList}
                </Button>
              </div>
              <UploadButton
                className={styles.importButton}
                icon={<FileImportIcon />}
                variant='outline'
              >
                {localization.catalogAdmin.importCodeList}
              </UploadButton>
            </div>
          </div>
          <Heading
            level={2}
            size='xsmall'
          >
            {localization.catalogAdmin.codeLists}
          </Heading>
          <div className={styles.content}>
            {getAllCodeLists &&
              getAllCodeLists.codeLists?.map((data: CodeList, index: number) => (
                <Accordion
                  key={index}
                  border={true}
                  className={styles.accordion}
                >
                  <Accordion.Item
                    ref={newAccordionRef}
                    open={
                      data.name.includes(`Ny kodeliste ${getNextNewCodeListNumber(getAllCodeLists.codeLists) - 1}`)
                        ? accordionIsOpen
                        : undefined
                    }
                  >
                    <Accordion.Header onClick={() => setAccordionIsOpen((prevState) => !prevState)}>
                      <h1 className={styles.label}>{data.name}</h1>
                      <p className={styles.description}> {data.description} </p>
                    </Accordion.Header>
                    <Accordion.Content>
                      <p className={styles.id}>ID: {data.id}</p>
                    </Accordion.Content>

                    <Accordion.Content>
                      <div className={styles.codeListInfo}>
                        <div className={styles.textField}>
                          <TextField
                            label={localization.name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleCodeListUpdate(data.id, event.target.value, undefined);
                            }}
                            value={(updatedCodeLists.find((c) => c.id === data.id) || data)?.name}
                          />
                        </div>
                        <div className={styles.textField}>
                          <TextField
                            label={localization.description}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleCodeListUpdate(data.id, undefined, event.target.value);
                            }}
                            value={(updatedCodeLists.find((c) => c.id === data.id) || data)?.description}
                          />
                        </div>
                      </div>

                      <CodeListEditor dbCodeList={data} />
                      <div className={styles.formButtons}>
                        <Button onClick={() => handleUpdateDbCodeList(data.id)}>{localization.saveEdits}</Button>
                        <Button
                          onClick={(e) => handleDeleteCodeList(data.id, e)}
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
