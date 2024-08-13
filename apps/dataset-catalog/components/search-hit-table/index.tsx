'use client';

import { Link, Table } from '@digdir/designsystemet-react';
import { dateStringToDate, formatDate, localization } from '@catalog-frontend/utils';
import { Dataset } from '@catalog-frontend/types';

export interface BannerProps {
  datasets: Dataset[];
}

export const SearchHitTable = ({ datasets }: BannerProps) => {
  return (
    <Table
      zebra
      border
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell
            onClick={function Ya() {}}
            sortable
          >
            {localization.title}
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={function Ya() {}}
            sortable
          >
            {localization.type}
          </Table.HeaderCell>
          <Table.HeaderCell sortable>{localization.lastChanged}</Table.HeaderCell>
          <Table.HeaderCell
            onClick={function Ya() {}}
            sortable
          >
            {localization.status}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {datasets.map((dataset) => (
          <Table.Row key={dataset.id}>
            <Table.Cell>
              {dataset.uri && (
                <Link href={dataset?.uri}>{dataset?.title?.nb ? dataset?.title?.nb : localization.noName}</Link>
              )}
            </Table.Cell>
            <Table.Cell>
              {dataset?.specializedType === 'SERIES'
                ? localization.datasetCatalog.series
                : localization.resourceType.dataset}
            </Table.Cell>
            <Table.Cell>{formatDate(dateStringToDate(dataset?._lastModified))}</Table.Cell>
            <Table.Cell>
              {dataset?.registrationStatus && localization.datasetCatalog.status[dataset.registrationStatus]}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
