"use client";

import {
  ConceptExtraction,
  ConceptExtractionStatus,
  ImportResult,
  ImportResutStatus,
} from "@catalog-frontend/types";
import styles from "./import-result-details.module.css";
import {
  Accordion,
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
    value: ImportResutStatus.COMPLETED,
    label: localization.importResult.completed,
  },
  {
    value: ImportResutStatus.PARTIALLY_COMPLETED,
    label: localization.importResult.partiallyCompleted,
  },
  { value: ImportResutStatus.FAILED, label: localization.importResult.failed },
  {
    value: ImportResutStatus.IN_PROGRESS,
    label: localization.importResult.inProgress,
  },
  {
    value: ImportResutStatus.CANCELLING,
    label: localization.importResult.cancelling,
  },
  {
    value: ImportResutStatus.CANCELLED,
    label: localization.importResult.cancelled,
  },
  {
    value: ImportResutStatus.SAVING,
    label: localization.importResult.savingInCatalog,
  },
  {
    value: ImportResutStatus.PENDING_CONFIRMATION,
    label: localization.importResult.pendingConfirmation,
  },
  {
    value: ConceptExtractionStatus.SAVING_FAILED,
    label: localization.importResult.savingFailed,
  },
];

const importStatusHelpTexts = [
  {
    value: ImportResutStatus.COMPLETED,
    label: localization.importResult.helpText.completed,
  },
  {
    value: ImportResutStatus.PARTIALLY_COMPLETED,
    label: localization.importResult.helpText.partiallyCompleted,
  },
  {
    value: ImportResutStatus.FAILED,
    label: localization.importResult.helpText.failed,
  },
  {
    value: ImportResutStatus.IN_PROGRESS,
    label: localization.importResult.helpText.inProgress,
  },
  {
    value: ImportResutStatus.CANCELLING,
    label: localization.importResult.helpText.cancelling,
  },
  {
    value: ImportResutStatus.CANCELLED,
    label: localization.importResult.helpText.cancelled,
  },
  {
    value: ImportResutStatus.SAVING,
    label: localization.importResult.helpText.savingInCatalog,
  },
  {
    value: ImportResutStatus.PENDING_CONFIRMATION,
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
      importResult.status === ImportResutStatus.FAILED &&
      importResult.failureMessage
    )
      return importResult.failureMessage;
    else if (importResult.status === ImportResutStatus.CANCELLED)
      return localization.importResult.cancelledImport;

    return "";
  };

  useEffect(() => {
    if (savingExternalId !== null) {
      console.log("External Id, triggering save:", savingExternalId);
      saveExtractedConcept(savingExternalId);
    }
  }, [savingExternalId]);

  async function saveExtractedConcept(externalId: string) {
    await saveConceptMutation?.mutate(externalId, {
      onSuccess: async () => {
        await setSavingExternalId(null);
      },
      onError: async () => {
        await setSavingExternalId(null);
      },
    });
  }

  const getButtonText = (conceptExtraction: ConceptExtraction) => {
    if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.PENDING_CONFIRMATION
    ) {
      return `Legg til i katalog`;
    } else if (
      conceptExtraction.conceptExtractionStatus ===
      ConceptExtractionStatus.SAVING_FAILED
    ) {
      return `Prøv igjen`;
    }
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
    if (savingExternalId !== null) {
      console.log("External ID: ", savingExternalId);
      console.log(
        "Concept Extraction: ",
        conceptExtraction?.extractionRecord?.externalId,
      );
    }

    return (
      savingExternalId != null &&
      conceptExtraction?.extractionRecord?.externalId != null &&
      String(savingExternalId) ==
        String(conceptExtraction?.extractionRecord?.externalId)
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
          importResult.status === ImportResutStatus.CANCELLING ||
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
            ) && <Spinner title={localization.loading} size="small" />}
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
            importResult.status === "CANCELLING" ||
            isDeleting ||
            cancelMutation?.isPending ||
            deleteImportMutation?.isPending) && (
            <div className={styles.spinnerOverlay}>
              <Spinner title={localization.loading} size="large" />
            </div>
          )}
          <div className={styles.title}>
            {"Import #" + importResult.id.slice(0, 5).toUpperCase()}
          </div>
          <div className={styles.titleTags}>
            <Tag
              size={"sm"}
              color={getColorFromStatusKey(importResult.status as StatusKey)}
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
                        ImportResutStatus.IN_PROGRESS && (
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

                      {importResult.status === "SAVING" && (
                        <>
                          {importResult.savedConcepts}/
                          {importResult.totalConcepts}
                          <progress
                            value={importResult.savedConcepts}
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
            size="sm"
            color="danger"
            disabled={
              isDeleting ||
              saveConceptMutation?.isPending ||
              !importResult.status ||
              !(
                importResult.status === ImportResutStatus.COMPLETED ||
                importResult.status === ImportResutStatus.PARTIALLY_COMPLETED ||
                importResult.status === ImportResutStatus.CANCELLED ||
                importResult.status === ImportResutStatus.FAILED
              )
            }
            onClick={() => deleteHandler(importResult.id)}
          >
            <TrashIcon title="Slett" fontSize="1.5rem" />
            Slett
          </Button>

          {showCancellationButton && (
            <Button
              variant="secondary"
              size="small"
              color="first"
              disabled={
                saveConceptMutation?.isPending ||
                importResult?.status === ImportResutStatus.CANCELLED ||
                importResult?.status === ImportResutStatus.FAILED ||
                importResult?.status === ImportResutStatus.SAVING ||
                importResult?.status === ImportResutStatus.COMPLETED ||
                importResult?.status === ImportResutStatus.PARTIALLY_COMPLETED
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
          <Heading level={2} size="lg">
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
                      <Accordion>
                        <ImportRecordAccordionItem
                          key={`result-${conceptExtraction?.extractionRecord?.internalId}`}
                          targetBaseHref={targetBaseHref}
                          conceptExtraction={conceptExtraction}
                          enableOpening={
                            importResult?.status !==
                              ImportResutStatus.PENDING_CONFIRMATION &&
                            importResult?.status !== ImportResutStatus.CANCELLED
                          }
                          isCompleted={
                            importResult.status === ImportResutStatus.COMPLETED
                          }
                        />
                      </Accordion>
                    </Table.Cell>

                    <Table.Cell style={{ width: "10%" }}>
                      <Tag
                        size={"sm"}
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
                        ImportResutStatus.PENDING_CONFIRMATION ||
                        importResult.status ===
                          ImportResutStatus.PARTIALLY_COMPLETED) &&
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
