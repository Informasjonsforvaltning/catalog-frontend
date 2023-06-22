import React from 'react';
import styles from './code-lists.module.css';
import { Button, Accordion, Label, Ingress } from '@digdir/design-system-react';
import { SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import data from './mock-data.json';
import { getToken } from 'next-auth/jwt';
import { hasOrganizationReadPermission } from '@catalog-frontend/utils';
import { CodeList } from '@catalog-frontend/types';
import { getAllCodeLists } from '@catalog-frontend/data-access';
import { useRouter } from 'next/router';
import { useCreateCodeList } from '../../../../../hooks/code-lists';

export const CodeListsPage = ({ codeLists }) => {
  const router = useRouter();
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
          {codeLists.codeLists &&
            codeLists.codeLists.map((data, index) => (
              <Accordion
                key={index}
                border={true}
                className={styles.accordion}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <h1 className={styles.label}>{data.name}</h1>
                    <p className={styles.description}> Description </p>
                  </Accordion.Header>
                  <Accordion.Content>Accordion content</Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;
  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      notFound: true,
    };
  }
  const codeLists: CodeList[] = await getAllCodeLists(catalogId, token.access_token);
  return {
    props: {
      codeLists,
    },
  };
}

export default CodeListsPage;
