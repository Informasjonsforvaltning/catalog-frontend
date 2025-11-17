"use client";

import {
  ImportResultStatus,
  ImportResultSummary,
} from "@catalog-frontend/types";
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
  importResultSummaries: ImportResultSummary[];
  showStatusHelpText?: boolean;
}

const ImportResultsTable = ({
  importHref,
  importResultSummaries,
  showStatusHelpText,
}: Props) => {
  const router = useRouter();
  const importResultHitTitle = (importResultSummary: ImportResultSummary) => {
    return (
      <div
        className={styles.bold}
      >{`Import #${importResultSummary.id.slice(0, 5).toUpperCase()}`}</div>
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
                <HelpMarkdown aria-label={`Help Status`}>
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
        {importResultSummaries.map((importResultSummary: ImportResultSummary) => (
          <Table.Row
            key={importResultSummary.id}
            className={styles.tableItem}
            onClick={() => router.push(`${importHref}/${importResultSummary.id}`)}
          >
            <Table.Cell>{importResultHitTitle(importResultSummary)}</Table.Cell>
            <Table.Cell>
              <TagImportResultStatus
                statusKey={importResultSummary.status}
                statusLabel={
                  importStatuses.find((st) => importResultSummary.status === st.value)
                    ?.label ?? importResultSummary.status
                }
              />
            </Table.Cell>
            <Table.Cell>{formatDate(importResultSummary.created)}</Table.Cell>
            <Table.Cell>
              {importResultSummary.recordsWithNoIssues ?? 0}
            </Table.Cell>
            <Table.Cell>
              {importResultSummary.warningIssues ?? 0}
            </Table.Cell>
            <Table.Cell>
              {importResultSummary.errorIssues ?? 0}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export { ImportResultsTable };
