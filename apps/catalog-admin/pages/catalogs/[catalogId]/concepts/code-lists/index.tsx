import React, { useState } from 'react';
import styles from './code-lists.module.css';
import { Accordion, TextField, Button } from '@digdir/design-system-react';
import { SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import {
  useCreateCodeList,
  useDeleteCodeList,
  useGetAllCodeLists,
  useUpdateCodeList,
} from '../../../../../hooks/code-lists';
import { CodeList } from '@catalog-frontend/types';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { CodeListEditor } from '../../../../../components/code-list-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { compare } from 'fast-json-patch';

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

  const handleCreateCodeList = () => {
    createCodeList.mutate(newCodeList, {
      onSuccess: () => {
        setAccordionIsOpen(true);
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

  return (
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
                Opprett ny kodeliste
              </Button>
            </div>
            <Button
              className={styles.importButton}
              icon={<FileImportIcon />}
              variant='outline'
            >
              Importer ny kodeliste
            </Button>
          </div>
        </div>
        <div className={styles.content}>
          {getAllCodeLists &&
            getAllCodeLists.codeLists?.map((data: CodeList, index: number) => (
              <Accordion
                key={index}
                border={true}
                className={styles.accordion}
              >
                <Accordion.Item open={data.name.includes('Ny kodeliste') ? accordionIsOpen : undefined}>
                  <Accordion.Header onClick={() => setAccordionIsOpen((prevState) => !prevState)}>
                    <h1 className={styles.label}>{data.name}</h1>
                    <p className={styles.description}> {data.description} </p>
                  </Accordion.Header>
                  <Accordion.Content>
                    <div>ID: {data.id}</div>
                  </Accordion.Content>

                  <Accordion.Content>
                    <div className={styles.codeListInfo}>
                      <TextField
                        label='Navn'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          handleCodeListUpdate(data.id, event.target.value, undefined);
                        }}
                        value={(updatedCodeLists.find((c) => c.id === data.id) || data)?.name}
                      />
                      <TextField
                        label='Beskrivelse'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          handleCodeListUpdate(data.id, undefined, event.target.value);
                        }}
                        value={(updatedCodeLists.find((c) => c.id === data.id) || data)?.description}
                      />
                    </div>

                    <CodeListEditor dbCodeList={data} />
                    <div className={styles.buttons}>
                      <Button onClick={() => handleUpdateDbCodeList(data.id)}>Lagre endringer</Button>
                      <Button
                        onClick={(e) => handleDeleteCodeList(data.id, e)}
                        color='danger'
                      >
                        Slett kodeliste
                      </Button>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CodeListsPage;
