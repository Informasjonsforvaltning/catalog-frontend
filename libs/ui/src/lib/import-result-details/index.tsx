'use client';

import { ImportResult } from '@catalog-frontend/types';
import styles from './import-result-details.module.css';
import { Accordion, Button, Heading, Tag } from '@digdir/designsystemet-react';
import { capitalizeFirstLetter, formatISO, localization } from '@catalog-frontend/utils';
import { ImportRecordAccordionItem } from './components/import-record-accordion-item';
import { TrashIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { ImportResultStatusColors, StatusKey } from '../tag/import-result-status/ImportResultStatus';
import { CenterContainer, HelpMarkdown } from '@catalog-frontend/ui';

interface Props {
  targetBaseHref: string;
  importResult: ImportResult;
  deleteHandler: (resultId: string) => void;
  confirmHandler?: (resultId: string) => void;
  cancelHandler?: (resultId: string) => void;
  showCancellationButton?: boolean;
  showConfirmationButton?: boolean;
}

const importStatuses = [
  { value: 'COMPLETED', label: localization.importResult.completed },
  { value: 'FAILED', label: localization.importResult.failed },
  { value: 'IN_PROGRESS', label: localization.importResult.inProgress },
  { value: 'CANCELLED', label: localization.importResult.cancelled },
  { value: 'SAVING', label: localization.importResult.savingInCatalog },
  { value: 'PENDING_CONFIRMATION', label: localization.importResult.pendingConfirmation },
];

const importStatusHelpTexts = [
  { value: 'COMPLETED', label: localization.importResult.helpText.completed },
  { value: 'FAILED', label: localization.importResult.helpText.failed },
  { value: 'IN_PROGRESS', label: localization.importResult.helpText.inProgress },
  { value: 'CANCELLED', label: localization.importResult.helpText.cancelled },
  { value: 'SAVING', label: localization.importResult.helpText.savingInCatalog },
  { value: 'PENDING_CONFIRMATION', label: localization.importResult.helpText.pendingConfirmation },
];

const ImportResultDetails = ({
  targetBaseHref,
  importResult,
  deleteHandler,
  confirmHandler,
  cancelHandler,
  showCancellationButton,
  showConfirmationButton,
}: Props) => {
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

  const getImportStatusDisplay = (status: string) => importStatuses.find((st) => status === st.value)?.label ?? status;

  const getImportStatusHelpTexts = (status: string) =>
    importStatusHelpTexts.find((st) => status === st.value)?.label ?? status;

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
              <div className={styles.titleTags}>
                {getImportStatusDisplay(importResult.status)}
                <HelpMarkdown aria-label={`Help ${getImportStatusHelpTexts(importResult.status)}`}>
                  {getImportStatusHelpTexts(importResult.status)}
                </HelpMarkdown>

                {cancelHandler &&
                  confirmHandler &&
                  importResult.totalConcepts !== undefined &&
                  importResult.totalConcepts > 0 && (
                    <div className={styles.progress}>
                      {importResult.status === 'IN_PROGRESS' && (
                        <>
                          {importResult.extractedConcepts}/{importResult.totalConcepts}
                          <progress
                            value={importResult.extractedConcepts}
                            max={importResult.totalConcepts}
                            style={{ width: 120, height: 16, accentColor: '#0d6efd' }}
                          />
                        </>
                      )}

                      {importResult.status === 'SAVING' && (
                        <>
                          {importResult.savedConcepts}/{importResult.totalConcepts}
                          <progress
                            value={importResult.savedConcepts}
                            max={importResult.totalConcepts}
                            style={{ width: 120, height: 16, accentColor: '#0d6efd' }}
                          />
                        </>
                      )}
                    </div>
                  )}
              </div>
            </Tag>
            <div className={styles.titleTags}>{formattedCreateDate}</div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant='tertiary'
            data-size='sm'
            color='danger'
            disabled={
              !importResult.status ||
              !(
                importResult.status === 'COMPLETED' ||
                importResult.status === 'CANCELLED' ||
                importResult.status === 'FAILED'
              )
            }
            onClick={() => deleteHandler(importResult.id)}
          >
            <TrashIcon
              title='Slett'
              fontSize='1.5rem'
            />
            Slett
          </Button>

          {showCancellationButton && (
            <Button
              variant='secondary'
              data-size='sm'
              color='first'
              disabled={
                !importResult.status ||
                importResult.status === 'CANCELLED' ||
                importResult.status === 'FAILED' ||
                importResult.status === 'SAVING' ||
                importResult.status === 'COMPLETED'
              }
              onClick={async () => {
                cancelHandler && cancelHandler(importResult.id);
              }}
            >
              {localization.importResult.cancelImport}
            </Button>
          )}

          {showConfirmationButton && (
            <Button
              variant='secondary'
              data-size='sm'
              color='first'
              disabled={!importResult.status || importResult.status !== 'PENDING_CONFIRMATION'}
              onClick={() => confirmHandler && confirmHandler(importResult.id)}
            >
              <CheckmarkIcon
                title='Legg til i katalog'
                fontSize='1.5rem'
              />
              {localization.importResult.confirmImport}
            </Button>
          )}
        </div>
      </div>
      {(!importResult.extractionRecords || importResult.extractionRecords?.length === 0) &&
        importResult.status === 'CANCELLED' && (
          <CenterContainer>
            <Heading
              level={2}
              data-size='lg'
            >
              {localization.importResult.cancelledImport}
            </Heading>
          </CenterContainer>
        )}
      {importResult?.extractionRecords && importResult?.extractionRecords.length > 0 && (
        <Accordion border={true}>
          {importResult?.extractionRecords?.map((record) => (
            <ImportRecordAccordionItem
              key={`result-${record.internalId}`}
              targetBaseHref={targetBaseHref}
              record={record}
              enableOpening={importResult?.status !== 'PENDING_CONFIRMATION' && importResult?.status !== 'CANCELLED'}
              isCompleted={importResult.status === 'COMPLETED'}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
};

export { ImportResultDetails };
