import React, { useState } from 'react';
import styles from './code-lists.module.css';
import { Button, Accordion, TextField } from '@digdir/design-system-react';
import { SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import { useCreateCodeList, useDeleteCodeList, useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { CodeList } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';

export const CodeListsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createCodeList = useCreateCodeList(catalogId);
  const deleteCodeList = useDeleteCodeList(catalogId);
  const [newCodeList, setNewCodeList] = useState(null);

  const handleCreateCodeList = () => {
    createCodeList.mutate(newCodeList, {
      onSuccess: () => {
        setNewCodeList('');
      },
    });
  };

  const handleDeleteCodeList = (codeListId: string, event) => {
    if (window.confirm(localization.codeList.confirmDelete)) {
      deleteCodeList.mutate(codeListId);
    }
  };
  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
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
                onClick={() => handleCreateCodeList()}
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
            getAllCodeLists.codeLists.map((data: CodeList, index: number) => (
              <Accordion
                key={index}
                border={true}
                className={styles.accordion}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <h1 className={styles.label}>{data.name}</h1>
                    <p className={styles.description}> {data.description} </p>
                  </Accordion.Header>
                  <Accordion.Content>
                    <button onClick={(e) => handleDeleteCodeList(data.id, e)}>Slett</button>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
          <TextField
            className={styles.textField}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewCodeList({ name: event.target.value, description: event.target.value, codes: [] });
            }}
          />
          {newCodeList && <p>{newCodeList.name}</p>}
        </div>
      </div>
    </div>
  );
};

// export async function getServerSideProps({ req, params }) {
//   const token = await getToken({ req });
//   const { catalogId } = params;
//   const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
//   if (!hasPermission) {
//     return {
//       notFound: true,
//     };
//   }

//   const organization: Organization = await getOrganization(catalogId);
//   return {
//     props: {
//       organization,
//     },
//   };
// }

export default CodeListsPage;
