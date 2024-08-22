'use client';

import { Table } from '@digdir/designsystemet-react';
import {
  dateStringToDate,
  formatDate,
  localization,
  sortAscending,
  sortDescending,
  sortDateStringsAscending,
  sortDateStringsDescending,
  getTranslateText,
} from '@catalog-frontend/utils';
import { DataService } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import styles from './search-hit-table.module.css';

export interface BannerProps {
  dataServices: DataService[];
}

type SortKey = 'title' | 'type' | 'modified' | 'status';

export const SearchHitTable = ({ dataServices }: BannerProps) => {
  const [sortedDataServices, setSorteddataServices] = useState<DataService[]>(dataServices);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortKey, setSortKey] = useState<SortKey>('title');

  useEffect(() => {
    // Sort dataServices whenever `dataServices`, `sortDirection`, or `sortKey` changes
    const sorted = [...dataServices].sort(getSortFunction(sortKey, sortDirection));
    setSorteddataServices(sorted);
  }, [dataServices, sortDirection, sortKey]);

  const getSortFunction = (key: SortKey, direction: 'asc' | 'desc') => {
    const sortFn =
      direction === 'asc'
        ? key === 'modified'
          ? sortDateStringsAscending
          : sortAscending
        : key === 'modified'
          ? sortDateStringsDescending
          : sortDescending;

    switch (key) {
      case 'title':
        return (a: DataService, b: DataService) => sortFn(a.title?.nb || '', b.title?.nb || '');
      case 'modified':
        return (a: DataService, b: DataService) => sortFn(a.modified || '', b.modified || '');
      case 'status':
        return (a: DataService, b: DataService) => sortFn(a.status || '', b.status || '');
      default:
        return () => 0;
    }
  };

  const handleSortClick = (key: SortKey) => {
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
            onClick={() => handleSortClick('modified')}
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
        {sortedDataServices.map((dataService) => (
          <Table.Row key={dataService.id}>
            <Table.Cell>{getTranslateText(dataService.title)}</Table.Cell>
            <Table.Cell>{formatDate(dateStringToDate(dataService.modified))}</Table.Cell>
            <Table.Cell>{dataService.status && localization.dataServiceCatalog.status[dataService.status]}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
