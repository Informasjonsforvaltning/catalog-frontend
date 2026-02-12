"use client";

import {
  ConceptExtraction,
  ConceptExtractionStatus,
  ImportResult,
  ImportResultStatus,
} from "@catalog-frontend/types";
import styles from "./import-result-details.module.css";
import {
  Details,
  Heading,
  Spinner,
  Table,
  Tag,
} from "@digdir/designsystemet-react";
import {
  capitalizeFirstLetter,
  formatISO,
  localization,
} from "@catalog-frontend/utils";
import { ImportRecordAccordionItem } from "./components/import-record-accordion-item";
import {
  ArrowCirclepathIcon,
  FloppydiskIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import React, { useEffect } from "react";
import {
  ImportResultStatusColors,
  StatusKey,
} from "../tag/import-result-status/ImportResultStatus";
import { Button, CenterContainer, HelpMarkdown } from "@catalog-frontend/ui";
import { useMutation } from "@tanstack/react-query";

interface Props {
  targetBaseHref: string;
  importResult: ImportResult;
  deleteHandler: (resultId: string) => void;
  saveConceptMutation?: ReturnType<typeof useMutation>;
  deleteImportMutation?: ReturnType<typeof useMutation>;
  cancelHandler?: (resultId: string) => void;
  cancelMutation?: ReturnType<typeof useMutation>;
  showCancellationButton?: boolean;
  isDeleting: boolean;
  isCancelling: boolean;
}

const importStatuses = [
  {
    value: ImportResultStatus.COMPLETED,
    label: localization.importResult.completed,
  },
  {
    value: ImportResultStatus.PARTIALLY_COMPLETED,
    label: localization.importResult.partiallyCompleted,
  },
  { value: ImportResultStatus.FAILED, label: localization.importResult.failed },
  {
    value: ImportResultStatus.IN_PROGRESS,
    label: localization.importResult.inProgress,
  },
  {
    value: ImportResultStatus.CANCELLED,
    label: localization.importResult.cancelled,
  },
  {
    value: ImportResultStatus.SAVING,
    label: localization.importResult.savingInCatalog,
  },
  {
    value: ImportResultStatus.PENDING_CONFIRMATION,
    label: localization.importResult.pendingConfirmation,
  },
  {
    value: ConceptExtractionStatus.SAVING_FAILED,
    label: localization.importResult.savingFailed,
  },
];

const importStatusHelpTexts = [
  {
    value: ImportResultStatus.COMPLETED,
    label: localization.importResult.helpText.completed,
  },
  {
    value: ImportResultStatus.PARTIALLY_COMPLETED,
    label: localization.importResult.helpText.partiallyCompleted,
  },
  {
    value: ImportResultStatus.FAILED,
    label: localization.importResult.helpText.failed,
  },
  {
    value: ImportResultStatus.IN_PROGRESS,
    label: localization.importResult.helpText.inProgress,
  },
  {
    value: ImportResultStatus.CANCELLING,
    label: localization.importResult.helpText.cancelling,
  },
  {
    value: ImportResultStatus.CANCELLED,
    label: localization.importResult.helpText.cancelled,
  },
  {
    value: ImportResultStatus.SAVING,
    label: localization.importResult.helpText.savingInCatalog,
  },
  {
    value: ImportResultStatus.PENDING_CONFIRMATION,
    label: localization.importResult.helpText.pendingConfirmation,
  },
];

const ImportResultDetails = ({
  targetBaseHref,
  importResult,
  deleteHandler,
  saveConceptMutation,
  deleteImportMutation,
  cancelHandler,
  cancelMutation,
  showCancellationButton,
  isDeleting,
  isCancelling,
}: Props) => {
  const formattedCreateDate = capitalizeFirstLetter(
    formatISO(importResult.created, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const [savingExternalId, setSavingExternalId] = React.useState<string | null>(
    null,
  );
  const getImportStatusDisplay = (status: string) =>
    importStatuses.find((st) => status === st.value)?.label ?? status;

  const getImportStatusHelpTexts = (status: string) =>
    importStatusHelpTexts.find((st) => status === st.value)?.label ?? status;

  const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
    statusKey
      ? ImportResultStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
      : "neutral";

  const getMessage = () => {
    if (
      importResult.status === ImportResultStatus.FAILED &&
      importResult.failureMessage
    )
      return importResult.failureMessage;
    else if (importResult.status === ImportResultStatus.CANCELLED)
      return localization.importResult.cancelledImport;

    return "";
  };

  useEffect(() => {
    if (savingExternalId !== null) saveExtractedConcept(savingExternalId);
  }, [savingExternalId]);

  function saveExtractedConcept(externalId: string) {
    saveConceptMutation?.mutate(externalId, {
      onSettled: () => setSavingExternalId(null),
    });
  }

  const getButtonText = (conceptExtraction: ConceptExtraction) => {
    if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.PENDING_CONFIRMATION
    )
      return `${localization.importResult.confirmImport}`;
    else if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.SAVING_FAILED
    )
      return `${localization.importResult.tryAgain}`;
  };

  const getButtonColor = (conceptExtraction: ConceptExtraction) => {
    if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.PENDING_CONFIRMATION
    ) {
      return "first";
    } else if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.SAVING_FAILED
    ) {
      return "danger";
    }
  };

  const checkIfSavingExternalIdMatches = (
    conceptExtraction: ConceptExtraction,
    savingExternalId: string | null,
  ): boolean => {
    return (
      savingExternalId != null &&
      conceptExtraction?.extractionRecord?.externalId != null &&
      savingExternalId == conceptExtraction?.extractionRecord?.externalId
    );
  };

  const getButton = (conceptExtraction: ConceptExtraction) => {
    return (
      <Button
        variant="primary"
        size="sm"
        color={getButtonColor(conceptExtraction)}
        disabled={
          isDeleting ||
          isCancelling ||
          importResult.status === ImportResultStatus.CANCELLING ||
          saveConceptMutation?.isPending ||
          deleteImportMutation?.isPending
        }
        onClick={() => {
          setSavingExternalId(conceptExtraction?.extractionRecord?.externalId);
        }}
      >
        <>
          {getButtonIcon(conceptExtraction)}
          {getButtonText(conceptExtraction)}
          {saveConceptMutation?.isPending &&
            checkIfSavingExternalIdMatches(
              conceptExtraction,
              savingExternalId,
            ) && <Spinner aria-label={localization.loading} data-size="sm" />}
        </>
      </Button>
    );
  };

  const getButtonIcon = (conceptExtraction: ConceptExtraction) => {
    if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.PENDING_CONFIRMATION
    ) {
      return <FloppydiskIcon fontSize="1.5rem" />;
    } else if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.SAVING_FAILED
    ) {
      return <ArrowCirclepathIcon fontSize="1.5rem" />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          {(isCancelling ||
            importResult.status === ImportResultStatus.CANCELLING ||
            isDeleting ||
            cancelMutation?.isPending ||
            deleteImportMutation?.isPending) && (
            <div className={styles.spinnerOverlay}>
              <Spinner aria-label={localization.loading} data-size="lg" />
            </div>
          )}
          <div className={styles.title}>
            {"Import #" + importResult.id.slice(0, 5).toUpperCase()}
          </div>
          <div className={styles.titleTags}>
            <Tag
              data-size="sm"
              data-color={getColorFromStatusKey(
                importResult.status as StatusKey,
              )}
            >
              <div className={styles.titleTags}>
                {getImportStatusDisplay(importResult.status)}
                <HelpMarkdown
                  aria-label={`Help ${getImportStatusHelpTexts(importResult.status)}`}
                >
                  {getImportStatusHelpTexts(importResult.status)}
                </HelpMarkdown>

                {cancelHandler &&
                  importResult.totalConcepts !== undefined &&
                  importResult.totalConcepts > 0 && (
                    <div className={styles.progress}>
                      {importResult.status ===
                        ImportResultStatus.IN_PROGRESS && (
                        <>
                          {importResult.extractedConcepts}/
                          {importResult.totalConcepts}
                          <progress
                            value={importResult.extractedConcepts}
                            max={importResult.totalConcepts}
                            style={{
                              width: 120,
                              height: 16,
                              accentColor: "#0d6efd",
                            }}
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
            variant="tertiary"
            data-size="sm"
            color="danger"
            disabled={
              isDeleting ||
              saveConceptMutation?.isPending ||
              !importResult.status ||
              !(
                importResult.status === ImportResultStatus.COMPLETED ||
                importResult.status ===
                  ImportResultStatus.PARTIALLY_COMPLETED ||
                importResult.status === ImportResultStatus.CANCELLED ||
                importResult.status === ImportResultStatus.FAILED
              )
            }
            onClick={() => deleteHandler(importResult.id)}
          >
            <TrashIcon title="Slett" fontSize="1.5rem" />
            {localization.importResult.deleteImport}
          </Button>

          {showCancellationButton && (
            <Button
              variant="secondary"
              data-size="sm"
              data-color="first"
              disabled={
                saveConceptMutation?.isPending ||
                importResult?.status === ImportResultStatus.CANCELLED ||
                importResult?.status === ImportResultStatus.FAILED ||
                importResult?.status === ImportResultStatus.SAVING ||
                importResult?.status === ImportResultStatus.COMPLETED ||
                importResult?.status === ImportResultStatus.PARTIALLY_COMPLETED
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
      {(!importResult.conceptExtractions ||
        importResult.conceptExtractions?.length === 0) && (
        <CenterContainer>
          <Heading level={2} data-size="lg">
            {getMessage()}
          </Heading>
        </CenterContainer>
      )}
      {importResult?.conceptExtractions &&
        importResult?.conceptExtractions.length > 0 && (
          <div className={styles.tableContainer}>
            <Table className={styles.tableFullWidth} zebra={true} border={true}>
              <Table.Head>
                <Table.Cell style={{ width: "70%" }}>
                  {localization.importResult.conceptId}
                </Table.Cell>
                <Table.Cell style={{ width: "10%" }}>Status</Table.Cell>
                <Table.Cell style={{ width: "20%" }} />
              </Table.Head>
              <Table.Body>
                {importResult?.conceptExtractions?.map((conceptExtraction) => (
                  <Table.Row
                    key={conceptExtraction?.extractionRecord?.internalId}
                  >
                    <Table.Cell style={{ width: "70%" }}>
                      <Details>
                        <ImportRecordAccordionItem
                          key={`result-${conceptExtraction?.extractionRecord?.internalId}`}
                          targetBaseHref={targetBaseHref}
                          conceptExtraction={conceptExtraction}
                          enableOpening={
                            importResult?.status !==
                              ImportResultStatus.PENDING_CONFIRMATION &&
                            importResult?.status !==
                              ImportResultStatus.CANCELLED
                          }
                          isCompleted={
                            importResult.status === ImportResultStatus.COMPLETED
                          }
                        />
                      </Details>
                    </Table.Cell>

                    <Table.Cell style={{ width: "10%" }}>
                      <Tag
                        data-size="sm"
                        color={getColorFromStatusKey(
                          conceptExtraction.conceptExtractionStatus as StatusKey,
                        )}
                      >
                        <div className={styles.titleTags}>
                          {getImportStatusDisplay(
                            conceptExtraction.conceptExtractionStatus,
                          )}
                        </div>
                      </Tag>
                    </Table.Cell>
                    <Table.Cell style={{ width: "20%" }}>
                      {(importResult.status ===
                        ImportResultStatus.PENDING_CONFIRMATION ||
                        importResult.status ===
                          ImportResultStatus.PARTIALLY_COMPLETED) &&
                        (conceptExtraction.conceptExtractionStatus ===
                          ConceptExtractionStatus.PENDING_CONFIRMATION ||
                          conceptExtraction.conceptExtractionStatus ===
                            ConceptExtractionStatus.SAVING_FAILED) &&
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
