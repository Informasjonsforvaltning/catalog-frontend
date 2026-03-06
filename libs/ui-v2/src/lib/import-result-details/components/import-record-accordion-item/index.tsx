"use client";

import styles from "./import-record-accordion-item.module.css";
import {
  Card,
  Details,
  Heading,
  List,
  Tag,
} from "@digdir/designsystemet-react";
import {
  ExclamationmarkTriangleIcon,
  XMarkOctagonIcon,
} from "@navikt/aksel-icons";
import { LinkButton } from "../../../button";
import {
  ConceptExtraction,
  ConceptExtractionStatus,
  ExtractionRecord,
} from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";

interface Props {
  targetBaseHref: string;
  conceptExtraction: ConceptExtraction;
  enableOpening: boolean;
  isCompleted: boolean;
}

const ImportRecordAccordionItem = ({
  targetBaseHref,
  conceptExtraction,
  enableOpening,
  isCompleted,
}: Props) => {
  const errors =
    conceptExtraction.extractionRecord.extractResult?.issues?.filter(
      (issue) => issue.type === "ERROR",
    ) ?? [];
  const warnings =
    conceptExtraction.extractionRecord.extractResult?.issues?.filter(
      (issue) => issue.type === "WARNING",
    ) ?? [];

  const decodeFromBase64 = (encodedBase64: string) =>
    Buffer.from(encodedBase64, "base64").toString("utf-8");

  const renderHeader = (record: ExtractionRecord) => {
    return (
      <div className={styles.recordHeader}>
        <div style={{ maxWidth: "90%" }}>
          {decodeFromBase64(record.externalId)}
        </div>
        {errors.length > 0 && (
          <Tag
            data-size="sm"
            data-color="danger"
          >{`${localization.importResult.errors}: ${errors.length}`}</Tag>
        )}
        {warnings.length > 0 && (
          <Tag
            data-size="sm"
            data-color="warning"
          >{`${localization.importResult.warnings}: ${warnings.length}`}</Tag>
        )}
        {errors.length === 0 && warnings.length === 0 && (
          <Tag data-size="sm" data-color="success">
            {localization.ok}
          </Tag>
        )}
      </div>
    );
  };

  return (
    <Details role="group">
      <Details.Summary
        role="button"
        slot="summary"
        tabIndex={0}
        aria-expanded="false"
      >
        {renderHeader(conceptExtraction.extractionRecord)}
      </Details.Summary>
      <Details.Content>
        {errors.length === 0 && enableOpening && (
          <div className={styles.buttonRow}>
            {(isCompleted ||
              conceptExtraction.conceptExtractionStatus ===
                ConceptExtractionStatus.COMPLETED) && (
              <LinkButton
                variant="tertiary"
                href={`/${targetBaseHref}/${conceptExtraction.extractionRecord.internalId}`}
              >
                {localization.importResult.goToImported}
              </LinkButton>
            )}
          </div>
        )}
        <div className={styles.issuesContainer}>
          {errors.length > 0 && (
            <Card key="error-card">
              <Card.Block>
                <Heading level={3} data-size="xs">
                  <div className={styles.issuesHeader}>
                    <XMarkOctagonIcon className={styles.errorIcon} />
                    <span>{localization.importResult.errors}</span>
                  </div>
                </Heading>
                <List.Unordered>
                  {errors.map((issue, i) => (
                    <List.Item key={`error-${i}`}>{issue.message}</List.Item>
                  ))}
                </List.Unordered>
              </Card.Block>
            </Card>
          )}
          {warnings.length > 0 && (
            <Card key="warning-card">
              <Card.Block>
                <Heading level={3} data-size="xs">
                  <div className={styles.issuesHeader}>
                    <ExclamationmarkTriangleIcon
                      className={styles.warningIcon}
                    />
                    <span>{localization.importResult.warnings}</span>
                  </div>
                </Heading>
                <List.Unordered>
                  {warnings.map((issue, i) => (
                    <List.Item key={`warning-${i}`}>{issue.message}</List.Item>
                  ))}
                </List.Unordered>
              </Card.Block>
            </Card>
          )}
        </div>
      </Details.Content>
    </Details>
  );
};

export { ImportRecordAccordionItem };
