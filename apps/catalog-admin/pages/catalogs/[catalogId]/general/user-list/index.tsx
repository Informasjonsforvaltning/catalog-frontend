import React from 'react';
import styles from './user-list.module.css';
import { Button, Accordion, Label, Ingress } from '@digdir/design-system-react';
import { SearchField } from '@catalog-frontend/ui';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';

export const CodeListsPage = () => {
  const testData = ['navn1', 'navn2', 'navn3'];
  return (
    <div className={styles.center}>
      <div className={styles.page}>
        <div className={styles.row}>
          <SearchField
            ariaLabel={''}
            placeholder='Søk etter kodeliste...'
          />
          <div className={styles.buttons}>
            <div className={styles.buttons}>
              <Button
                className={styles.createButton}
                icon={<PlusCircleIcon />}
              >
                {localization.catalogAdmin.addUser}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          {testData.map((data, index) => (
            <Accordion
              key={index}
              border={true}
              className={styles.accordion}
            >
              <Accordion.Item>
                <Accordion.Header>
                  <h1 className={styles.label}>{data}</h1>
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
