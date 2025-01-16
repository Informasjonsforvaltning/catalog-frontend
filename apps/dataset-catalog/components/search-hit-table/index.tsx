'use client';

import { Link, Table } from '@digdir/designsystemet-react';
import {
  dateStringToDate,
  formatDate,
  localization,
  sortAscending,
  sortDescending,
  sortDateStringsAscending,
  sortDateStringsDescending,
} from '@catalog-frontend/utils';
import { Dataset } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import styles from './search-hit-table.module.css';

export interface BannerProps {
  datasets: Dataset[];
}

export const SearchHitTable = ({ datasets }: BannerProps) => {
  const [sortedDatasets, setSortedDatasets] = useState<Dataset[]>(datasets);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortKey, setSortKey] = useState<'title' | 'type' | 'lastChanged' | 'status'>('title');

  useEffect(() => {
    // Sort datasets whenever `datasets`, `sortDirection`, or `sortKey` changes
    const sorted = [...datasets].sort(getSortFunction(sortKey, sortDirection));
    setSortedDatasets(sorted);
  }, [datasets, sortDirection, sortKey]);

  const getSortFunction = (key: 'title' | 'type' | 'lastChanged' | 'status', direction: 'asc' | 'desc') => {
    const sortFn =
      direction === 'asc'
        ? key === 'lastChanged'
          ? sortDateStringsAscending
          : sortAscending
        : key === 'lastChanged'
          ? sortDateStringsDescending
          : sortDescending;

    switch (key) {
      case 'title':
        return (a: Dataset, b: Dataset) => sortFn(a.title?.nb?.toString() || '', b.title?.nb?.toString() || '');
      case 'type':
        return (a: Dataset, b: Dataset) => sortFn(a.specializedType || '', b.specializedType || '');
      case 'lastChanged':
        return (a: Dataset, b: Dataset) => sortFn(a._lastModified || '', b._lastModified || '');
      case 'status':
        return (a: Dataset, b: Dataset) => sortFn(a.registrationStatus || '', b.registrationStatus || '');
      default:
        return () => 0;
    }
  };

  const handleSortClick = (key: 'title' | 'type' | 'lastChanged' | 'status') => {
    if (sortKey === key) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <Table
      zebra
      border
      className={styles.table}
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell
            onClick={() => handleSortClick('title')}
            sortable
          >
            {localization.title}
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={() => handleSortClick('type')}
            sortable
          >
            {localization.type}
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={() => handleSortClick('lastChanged')}
            sortable
          >
            {localization.lastChanged}
          </Table.HeaderCell>
          <Table.HeaderCell
            onClick={() => handleSortClick('status')}
            sortable
          >
            {localization.status}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedDatasets.map((dataset) => (
          <Table.Row key={dataset.id}>
            <Table.Cell>
              {dataset && (
                <Link href={`/catalogs/${dataset.catalogId}/datasets/${dataset.id}`}>
                  {dataset.title?.nb || localization.noName}
                </Link>
              )}
            </Table.Cell>
            <Table.Cell>
              {dataset.specializedType === 'SERIES'
                ? localization.datasetCatalog.series
                : localization.resourceType.dataset}
            </Table.Cell>
            <Table.Cell>{formatDate(dateStringToDate(dataset._lastModified))}</Table.Cell>
            <Table.Cell>
              {dataset.registrationStatus && localization.datasetCatalog.status[dataset.registrationStatus]}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
