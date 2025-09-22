'use client';

import styles from './import-record-accordion-item.module.css';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  Card,
  Heading,
  List,
  Tag,
} from '@digdir/designsystemet-react';
import { ExclamationmarkTriangleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { LinkButton } from '../../../button';
import { ExtractionRecord } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';

interface Props {
  targetBaseHref: string;
  record: ExtractionRecord;
  enableOpening: boolean;
}

const ImportRecordAccordionItem = ({ targetBaseHref, record, enableOpening }: Props) => {
  const errors = record.extractResult?.issues?.filter((issue) => issue.type === 'ERROR') ?? [];
  const warnings = record.extractResult?.issues?.filter((issue) => issue.type === 'WARNING') ?? [];

  const renderHeader = (record: ExtractionRecord) => {
    return (
      <div className={styles.recordHeader}>
        <div>{record.externalId}</div>
        {errors.length > 0 && (
          <Tag
            size={'sm'}
            color={'danger'}
          >{`${localization.importResult.errors}: ${errors.length}`}</Tag>
        )}
        {warnings.length > 0 && (
          <Tag
            size={'sm'}
            color={'warning'}
          >{`${localization.importResult.warnings}: ${warnings.length}`}</Tag>
        )}
        {errors.length === 0 && warnings.length === 0 && (
          <Tag
            size={'sm'}
            color={'success'}
          >
            {localization.ok}
          </Tag>
        )}
      </div>
    );
  };

  return (
    <AccordionItem>
      <AccordionHeader>{renderHeader(record)}</AccordionHeader>
      <AccordionContent>
        {errors.length === 0 && enableOpening && (
          <div className={styles.buttonRow}>
            <LinkButton
              variant={'tertiary'}
              href={`/${targetBaseHref}/${record.internalId}`}
            >
              {localization.importResult.goToImported}
            </LinkButton>
          </div>
        )}
        <div className={styles.issuesContainer}>
          {errors.length > 0 && (
            <Card key={'error-card'}>
              <Card.Content>
                <Heading
                  level={3}
                  size={'xs'}
                >
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
              </Card.Content>
            </Card>
          )}
          {warnings.length > 0 && (
            <Card key={'warning-card'}>
              <Card.Content>
                <Heading
                  level={3}
                  size={'xs'}
                >
                  <div className={styles.issuesHeader}>
                    <ExclamationmarkTriangleIcon className={styles.warningIcon} />
                    <span>{localization.importResult.warnings}</span>
                  </div>
                </Heading>
                <List.Unordered>
                  {warnings.map((issue, i) => (
                    <List.Item key={`warning-${i}`}>{issue.message}</List.Item>
                  ))}
                </List.Unordered>
              </Card.Content>
            </Card>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export { ImportRecordAccordionItem };
