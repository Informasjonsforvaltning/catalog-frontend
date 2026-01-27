"use client";

import { ImportResult, ImportResultStatus } from "@catalog-frontend/types";
import styles from "./import-results-table.module.css";
import { Table, Tooltip } from "@digdir/designsystemet-react";
import {
  capitalizeFirstLetter,
  formatISO,
  localization,
} from "@catalog-frontend/utils";
import { TagImportResultStatus } from "../tag";
import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  XMarkOctagonIcon,
} from "@navikt/aksel-icons";
import { useRouter } from "next/navigation";
import { HelpMarkdown } from "../help-markdown";

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
    value: ImportResultStatus.PENDING_CONFIRMATION,
    label: localization.importResult.pendingConfirmation,
  },
];

interface Props {
  importHref: string;
  importResults: ImportResult[];
  showStatusHelpText?: boolean;
}

const ImportResultsTable = ({
  importHref,
  importResults,
  showStatusHelpText,
}: Props) => {
  const router = useRouter();
  const importResultHitTitle = (importResult: ImportResult) => {
    return (
      <div
        className={styles.bold}
      >{`Import #${importResult.id.slice(0, 5).toUpperCase()}`}</div>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "";
    }

    return capitalizeFirstLetter(
      formatISO(date, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  return (
    <Table zebra={true} border={true}>
      <Table.Head>
        <Table.Row>
          <Table.Cell>
            {localization.importResult.tableHeading.title}
          </Table.Cell>
          <Table.Cell>
            <div className={styles.titleTags}>
              {localization.importResult.tableHeading.status}
              {showStatusHelpText && (
                <HelpMarkdown aria-label="Help Status">
                  {
                    localization.importResult.tableHeading
                      .statusHelpTextConceptImport
                  }
                </HelpMarkdown>
              )}
            </div>
          </Table.Cell>
          <Table.Cell>
            {localization.importResult.tableHeading.timestamp}
          </Table.Cell>
          <Table.Cell>
            <Tooltip content={localization.importResult.tooltip.ok}>
              <CheckmarkCircleIcon className={styles.successIcon} />
            </Tooltip>
          </Table.Cell>
          <Table.Cell>
            <Tooltip content={localization.importResult.tooltip.warning}>
              <ExclamationmarkTriangleIcon className={styles.warningIcon} />
            </Tooltip>
          </Table.Cell>
          <Table.Cell>
            <Tooltip content={localization.importResult.tooltip.error}>
              <XMarkOctagonIcon className={styles.errorIcon} />
            </Tooltip>
          </Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {importResults.map((importResult: ImportResult) => (
          <Table.Row
            key={importResult.id}
            className={styles.tableItem}
            onClick={() => router.push(`${importHref}/${importResult.id}`)}
          >
            <Table.Cell>{importResultHitTitle(importResult)}</Table.Cell>
            <Table.Cell>
              <TagImportResultStatus
                statusKey={importResult.status}
                statusLabel={
                  importStatuses.find((st) => importResult.status === st.value)
                    ?.label ?? importResult.status
                }
              />
            </Table.Cell>
            <Table.Cell>{formatDate(importResult.created)}</Table.Cell>
            <Table.Cell>
              {importResult?.conceptExtractions
                ?.map((conceptExtraction) => conceptExtraction.extractionRecord)
                ?.filter((record) => record.extractResult?.issues.length === 0)
                .length ?? 0}
            </Table.Cell>
            <Table.Cell>
              {importResult?.conceptExtractions
                ?.map((conceptExtraction) => conceptExtraction.extractionRecord)
                ?.filter(
                  (record) =>
                    !record.extractResult?.issues.some(
                      (issue) => issue.type === "WARNING",
                    ),
                ).length ?? 0}
            </Table.Cell>
            <Table.Cell>
              {importResult?.conceptExtractions
                ?.map((conceptExtraction) => conceptExtraction.extractionRecord)
                ?.filter((record) =>
                  record.extractResult?.issues.some(
                    (issue) => issue.type === "ERROR",
                  ),
                ).length ?? 0}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export { ImportResultsTable };
