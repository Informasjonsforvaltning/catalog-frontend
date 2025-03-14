'use client';

import { ImportResult } from '@catalog-frontend/types';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  Alert,
  Card,
  Divider,
  Heading,
} from '@digdir/designsystemet-react';
import Link from 'next/link';
import { capitalizeFirstLetter, formatISO } from '@catalog-frontend/utils';

interface Props {
  catalogId: string;
  importResult: ImportResult;
}

const ImportResultDetailsPageClient = ({ catalogId, importResult }: Props) => {
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
    <div>
      {importResult.status === 'COMPLETED' ? (
        <Alert severity={'success'}>Gjennomført import {formattedCreateDate}</Alert>
      ) : (
        <Alert severity={'danger'}>Mislykket import {formattedCreateDate}</Alert>
      )}
      {importResult?.extractionRecords?.map((record) => (
        <Card key={record.internalId}>
          <Heading size={'xs'}>Identifikator</Heading>
          <p>Ekstern identifikator: {record.externalId}</p>
          <p>
            Intern identifikator{' '}
            {importResult.status === 'COMPLETED' ? (
              <Link href={`/catalogs/${catalogId}/data-services/${record.internalId}`}>{record.internalId}</Link>
            ) : (
              <span>{record.internalId}</span>
            )}
          </p>
          {record.extractResult?.issues && record.extractResult.issues.length > 0 && (
            <>
              <Divider />
              <Heading size={'xs'}>Feil og advarsler</Heading>
              <ul>
                {record.extractResult?.issues?.map((issue, i) => (
                  <li key={`issue-${i}`}>
                    {issue.type === 'ERROR' ? (
                      <Alert severity={'danger'}>{issue.message}</Alert>
                    ) : (
                      <Alert severity={'warning'}>{issue.message}</Alert>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          <Divider />
          <Heading size={'xs'}>Operasjoner</Heading>
          <Accordion>
            {record?.extractResult?.operations?.map((operation, i) => (
              <AccordionItem key={`operations-${record.internalId}`}>
                <AccordionHeader>
                  {operation.op} - {operation.path}
                </AccordionHeader>
                <AccordionContent>
                  <div key={`operation-${i}`}>
                    <div>{JSON.stringify(operation.value)}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      ))}
    </div>
  );
};

export default ImportResultDetailsPageClient;
