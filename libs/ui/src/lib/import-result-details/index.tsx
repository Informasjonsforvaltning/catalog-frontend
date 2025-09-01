'use client';

import { ImportResult } from '@catalog-frontend/types';
import styles from './import-result-details.module.css';
import { Accordion, Button, Tag } from '@digdir/designsystemet-react';
import { capitalizeFirstLetter, formatISO, localization } from '@catalog-frontend/utils';
import { ImportRecordAccordionItem } from './components/import-record-accordion-item';
import { TrashIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { ImportResultStatusColors, StatusKey } from '../tag/import-result-status/ImportResultStatus';

interface Props {
  targetBaseHref: string;
  importResult: ImportResult;
  deleteHandler: (resultId: string) => void;
  confirmHandler: (resultId: string) => void;
  cancelHandler: (resultId: string) => void;
}

const importStatuses = [
  { value: 'COMPLETED', label: localization.importResult.completed },
  { value: 'FAILED', label: localization.importResult.failed },
  { value: 'IN_PROGRESS', label: localization.importResult.inProgress },
  { value: 'CANCELLED', label: localization.importResult.cancelled },
  { value: 'PENDING_CONFIRMATION', label: localization.importResult.pendingConfirmation },
];

const ImportResultDetails = ({ targetBaseHref, importResult, deleteHandler, confirmHandler, cancelHandler }: Props) => {
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

  console.log("Import result", importResult)

  const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
    statusKey ? ImportResultStatusColors[statusKey.toLocaleUpperCase() as StatusKey] : 'neutral';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{'Import #' + importResult.id.slice(0, 5).toUpperCase()}</div>
          <div className={styles.titleTags}>
            <Tag
              size={'sm'}
              color={getColorFromStatusKey(importResult.status as StatusKey)}
            >
              {importStatuses.find((st) => importResult.status === st.value)?.label ?? importResult.status}
            </Tag>
            <div className={styles.titleTags}>{formattedCreateDate}</div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant='tertiary'
            size='sm'
            color='danger'
            disabled={!importResult.status || !(importResult.status === 'COMPLETED' ||
              importResult.status === 'CANCELLED' || importResult.status === 'FAILED')}
            onClick={() => deleteHandler(importResult.id)}
          >
            <TrashIcon
              title='Slett'
              fontSize='1.5rem'
            />
            Slett
          </Button>

          <Button
            variant='secondary'
            size='small'
            color='first'
            disabled={ !importResult.status ||
              importResult.status === 'CANCELLED' ||
              importResult.status === 'FAILED' ||
              importResult.status === 'COMPLETED'
            }
            onClick={() => cancelHandler(importResult.id)}
          >
            Avvis
          </Button>

          <Button
            variant='secondary'
            size='small'
            color='first'
            disabled={!importResult.status || importResult.status !== 'PENDING_CONFIRMATION'}
            onClick={() => confirmHandler(importResult.id)}
          >
            <CheckmarkIcon
              title='Bekreft å lagre'
              fontSize='1.5rem'
            />
            Bekreft å lagre
          </Button>
        </div>
      </div>
      <Accordion border={true}>
        {importResult?.extractionRecords?.map((record) => (
          <ImportRecordAccordionItem
            key={`result-${record.internalId}`}
            targetBaseHref={targetBaseHref}
            record={record}
            enableOpening={importResult?.status !== 'PENDING_CONFIRMATION' && importResult?.status !== 'CANCELLED'}
          />
        ))}
      </Accordion>
    </div>
  );
};

export { ImportResultDetails };
