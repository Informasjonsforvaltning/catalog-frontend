import React from 'react';
import styles from './code-lists.module.css';
import { Button, Accordion, Label, Ingress } from '@digdir/design-system-react';
import { SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import data from './mock-data.json';

export const CodeListsPage = () => {
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
          {data.map((data, index) => (
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

export default CodeListsPage;
