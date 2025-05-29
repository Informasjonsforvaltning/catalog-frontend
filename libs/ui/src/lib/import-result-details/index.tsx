'use client';

import { ImportResult } from '@catalog-frontend/types';
import styles from './import-result-details.module.css';
import { Accordion, Button, Tag } from '@digdir/designsystemet-react';
import { capitalizeFirstLetter, formatISO, localization } from '@catalog-frontend/utils';
import { ImportRecordAccordionItem } from './components/import-record-accordion-item';
import { TrashIcon } from '@navikt/aksel-icons';
import React from 'react';

interface Props {
  targetBaseHref: string;
  importResult: ImportResult;
  deleteHandler: (resultId: string) => void;
}

const ImportResultDetails = ({ targetBaseHref, importResult, deleteHandler }: Props) => {
  const formattedCreateDate = capitalizeFirstLetter(
    formatISO(importResult.created, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{'Import #' + importResult.id.slice(0, 5).toUpperCase()}</div>
          <div className={styles.titleTags}>
            <Tag
              size={'sm'}
              color={importResult.status === 'COMPLETED' ? 'success' : 'danger'}
            >
              {importResult.status === 'COMPLETED'
                ? localization.importResult.completed
                : localization.importResult.failed}
            </Tag>
            <div>{formattedCreateDate}</div>
          </div>
        </div>
        <Button
          variant='tertiary'
          size='sm'
          color='danger'
          onClick={() => deleteHandler(importResult.id)}
        >
          <TrashIcon
            title='Slett'
            fontSize='1.5rem'
          />
          Slett
        </Button>
      </div>
      <Accordion border={true}>
        {importResult?.extractionRecords?.map((record) => (
          <ImportRecordAccordionItem
            key={`result-${record.internalId}`}
            targetBaseHref={targetBaseHref}
            record={record}
          />
        ))}
      </Accordion>
    </div>
  );
};

export { ImportResultDetails };
