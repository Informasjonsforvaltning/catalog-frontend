'use client';

import { ConceptExtraction, ImportResult } from '@catalog-frontend/types';
import styles from './import-result-details.module.css';
import { Accordion, Heading, Spinner, Table, Tag } from '@digdir/designsystemet-react';
import { capitalizeFirstLetter, formatISO, localization } from '@catalog-frontend/utils';
import { ImportRecordAccordionItem } from './components/import-record-accordion-item';
import { TrashIcon, FloppydiskIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import React from 'react';
import { ImportResultStatusColors, StatusKey } from '../tag/import-result-status/ImportResultStatus';
import { Button, CenterContainer, HelpMarkdown } from '@catalog-frontend/ui';
import { useMutation } from '@tanstack/react-query';

interface Props {
  targetBaseHref: string;
  importResult: ImportResult;
  deleteHandler: (resultId: string) => void;
  saveConceptMutation?: ReturnType<typeof useMutation>;
  cancelHandler?: (resultId: string) => void;
  cancelMutation?: ReturnType<typeof useMutation>;
  showCancellationButton?: boolean;
}

const importStatuses = [
  { value: 'COMPLETED', label: localization.importResult.completed },
  { value: 'PARTIALLY_COMPLETED', label: localization.importResult.partiallyCompleted },
  { value: 'FAILED', label: localization.importResult.failed },
  { value: 'IN_PROGRESS', label: localization.importResult.inProgress },
  { value: 'CANCELLED', label: localization.importResult.cancelled },
  { value: 'SAVING', label: localization.importResult.savingInCatalog },
  { value: 'PENDING_CONFIRMATION', label: localization.importResult.pendingConfirmation },
];

const importStatusHelpTexts = [
  { value: 'COMPLETED', label: localization.importResult.helpText.completed },
  { value: 'PARTIALLY_COMPLETED', label: localization.importResult.helpText.partiallyCompleted },
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
  saveConceptMutation,
  cancelHandler,
  showCancellationButton,
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

  const getMessage = () => {
    if (importResult.status === 'FAILED' && importResult.failureMessage)
      return importResult.failureMessage;
    else if (importResult.status === 'CANCELLED')
      return localization.importResult.cancelledImport;

    return "";
  }

  function saveExtractedConcept(externalId: string) {
    console.log("Saving concept with externalId:", externalId);
    saveConceptMutation?.mutate(externalId)
  }

  const getButtonText = (conceptExtraction: ConceptExtraction)=> {
    if(conceptExtraction.conceptExtractionStatus === 'PENDING_CONFIRMATION') {
      return `Legg til i katalog`;
    } else if(conceptExtraction.conceptExtractionStatus === 'FAILED') {
      return `Prøv igjen`;
    }
  }

  const getButtonColor = (conceptExtraction: ConceptExtraction) => {
    if(conceptExtraction.conceptExtractionStatus === 'PENDING_CONFIRMATION') {
      return 'first';
    } else if(conceptExtraction.conceptExtractionStatus === 'FAILED') {
      return 'danger';
    }
  }

  const getButton = (conceptExtraction: ConceptExtraction)=> {
      return (
        <Button
          variant='primary'
          size='sm'
          color={getButtonColor(conceptExtraction)}
          onClick={() => saveExtractedConcept(conceptExtraction?.extractionRecord?.externalId)}
          >
          <>
            {getButtonIcon(conceptExtraction)}
            {getButtonText(conceptExtraction)}
          </>
        </Button>
      )
  }

  const getButtonIcon = (conceptExtraction: ConceptExtraction) => {
    if(conceptExtraction.conceptExtractionStatus === 'PENDING_CONFIRMATION') {
      return <FloppydiskIcon fontSize='1.5rem'/>;
    } else if(conceptExtraction.conceptExtractionStatus === 'FAILED') {
      return <ArrowCirclepathIcon fontSize='1.5rem'/>;
    }
  }

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
            size='sm'
            color='danger'
            disabled={
              saveConceptMutation?.isPending || !importResult.status ||
              !(
                importResult.status === 'COMPLETED' ||
                importResult.status === 'PARTIALLY_COMPLETED' ||
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
              size='small'
              color='first'
              disabled={
                saveConceptMutation?.isPending ||
                importResult?.status === 'CANCELLED' ||
                importResult?.status === 'FAILED' ||
                importResult?.status === 'SAVING' ||
                importResult?.status === 'COMPLETED' ||
                importResult?.status === 'PARTIALLY_COMPLETED'
              }
              onClick={async () => {
                cancelHandler && cancelHandler(importResult.id);
              }}
            >
              {localization.importResult.cancelImport}
            </Button>
          )}
        </div>
      </div>
      {(!importResult.extractionRecords || importResult.extractionRecords?.length === 0) &&
        (
          <CenterContainer>
            <Heading
              level={2}
              size='lg'
            >
              {getMessage()}
            </Heading>
          </CenterContainer>
        )}
      {importResult?.extractionRecords && importResult?.extractionRecords.length > 0 && (
        <div className={styles.tableContainer}>
          { saveConceptMutation?.isPending &&
            <div className={styles.spinnerOverlay}>
              <Spinner
                title={localization.loading}
                size='large'
              />
            </div>
          }
          <Table
            className={styles.tableFullWidth}
            zebra={true}
            border={true}
          >
            <Table.Head>
              <Table.Cell style={{ width: '70%' }}>{localization.importResult.conceptId}</Table.Cell>
              <Table.Cell style={{ width: '10%' }}>Status</Table.Cell>
              <Table.Cell style={{ width: '20%' }}/>
            </Table.Head>
            <Table.Body>
              {importResult?.conceptExtractions?.map((conceptExtraction) => (
                <Table.Row key={conceptExtraction?.extractionRecord?.internalId}>
                  <Table.Cell style={{ width: '70%' }} >
                    <Accordion>
                      <ImportRecordAccordionItem
                        key={`result-${conceptExtraction?.extractionRecord?.internalId}`}
                        targetBaseHref={targetBaseHref}
                        conceptExtraction={conceptExtraction}
                        enableOpening={
                          importResult?.status !== 'PENDING_CONFIRMATION' && importResult?.status !== 'CANCELLED'
                        }
                        isCompleted={importResult.status === 'COMPLETED'}
                      />
                    </Accordion>
                  </Table.Cell>

                  <Table.Cell style={{ width: '10%' }} >
                    <Tag
                      size={'sm'}
                      color={getColorFromStatusKey(conceptExtraction.conceptExtractionStatus as StatusKey)}
                    >
                      <div className={styles.titleTags}>
                        {getImportStatusDisplay(conceptExtraction.conceptExtractionStatus)}
                      </div>
                    </Tag>
                  </Table.Cell>
                  <Table.Cell style={{ width: '20%' }}>
                    {(conceptExtraction.conceptExtractionStatus === 'PENDING_CONFIRMATION' ||
                      conceptExtraction.conceptExtractionStatus === 'FAILED') &&
                      getButton(conceptExtraction)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export { ImportResultDetails };
