'use client';

import { ImportResult } from '@catalog-frontend/types';
import styles from './import-results.module.css';
import { Chip, NativeSelect, Table, Tooltip } from '@digdir/designsystemet-react';
import {
  capitalizeFirstLetter,
  formatISO,
  getTranslateText,
  localization,
  sortDateStringsAscending,
  sortDateStringsDescending,
} from '@catalog-frontend/utils';
import { TagImportResultStatus } from '../tag';
import { SearchHitContainer } from '../search-hit-container';
import { SearchHitsLayout } from '../search-hits-layout';
import React, { useEffect, useMemo, useState } from 'react';
import { parseAsArrayOf, parseAsString, parseAsInteger, useQueryState } from 'nuqs';
import { ImportFilter } from './components/import-filter';
import { isEmpty } from 'lodash';
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';

const importStatuses = [
  { value: 'COMPLETED', label: localization.importResult.completed },
  { value: 'FAILED', label: localization.importResult.failed },
];

interface Props {
  importHref: string;
  importResults: ImportResult[];
}

const ImportResults = ({ importHref, importResults }: Props) => {
  const router = useRouter();
  const [filteredImportResults, setFilteredImportResults] = useState<ImportResult[]>(importResults);
  const [sortType, setSortType] = useQueryState<string>('sort.type', parseAsString);
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [page, setPage] = useQueryState('page', parseAsInteger);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const getSortFunction = (sortKey: string) => {
    if (sortKey === 'createdAsc') {
      return (a: ImportResult, b: ImportResult) => sortDateStringsAscending(a.created, b.created);
    }
    return (a: ImportResult, b: ImportResult) => sortDateStringsDescending(a.created, b.created);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };

  const importResultHitTitle = (importResult: ImportResult) => {
    return <div className={styles.bold}>{`Import #${importResult.id.slice(0, 5).toUpperCase()}`}</div>;
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return '';
    }

    return capitalizeFirstLetter(
      formatISO(date, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
  };

  const FilterChips = () => (
    <div className={styles.chips}>
      <Chip.Group
        size='small'
        className={styles.wrap}
      >
        {filterStatus?.map((filter, index) => (
          <Chip.Removable
            key={`status-${index}`}
            onClick={() => setFilterStatus(filterStatus?.filter((value) => value !== filter) ?? [])}
          >
            {getTranslateText(importStatuses?.find((s) => s.value === filter)?.label)}
          </Chip.Removable>
        ))}
      </Chip.Group>
    </div>
  );

  useEffect(() => {
    const filteredImportResults = () => {
      let filtered = importResults;

      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter((result) => result.status && filterStatus?.includes(result.status));
      }

      filtered = [...filtered].sort(getSortFunction(sortType ?? ''));

      setFilteredImportResults(filtered);
    };

    filteredImportResults();
  }, [importResults, sortType, filterStatus]);

  const paginatedImportResults = useMemo(() => {
    setTotalPages(Math.ceil(filteredImportResults.length / itemsPerPage));
    const startIndex = page ? page * itemsPerPage : 0;
    const endIndex = startIndex + itemsPerPage;
    return filteredImportResults?.slice(startIndex, endIndex);
  }, [filteredImportResults, page]);

  return (
    <SearchHitsLayout>
      <SearchHitsLayout.SearchRow>
        <NativeSelect
          size='sm'
          className={styles.select}
          onChange={handleSortChange}
        >
          <option value=''>{localization.search.sortOptions.NEWEST_FIRST}</option>
          <option value='createdAsc'>{localization.search.sortOptions.LAST_UPDATED_LAST}</option>
        </NativeSelect>
      </SearchHitsLayout.SearchRow>
      <SearchHitsLayout.LeftColumn>
        <ImportFilter importStatuses={importStatuses} />
        <FilterChips />
      </SearchHitsLayout.LeftColumn>
      <SearchHitsLayout.MainColumn>
        <SearchHitContainer
          searchHits={
            paginatedImportResults.length > 0 ? (
              <Table
                zebra={true}
                border={true}
              >
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>{localization.importResult.tableHeading.title}</Table.Cell>
                    <Table.Cell>{localization.importResult.tableHeading.status}</Table.Cell>
                    <Table.Cell>{localization.importResult.tableHeading.timestamp}</Table.Cell>
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
                  {paginatedImportResults.map((result: ImportResult) => (
                    <Table.Row
                      key={result.id}
                      className={styles.searchHit}
                      onClick={() => router.push(`${importHref}/${result.id}`)}
                    >
                      <Table.Cell>{importResultHitTitle(result)}</Table.Cell>
                      <Table.Cell>
                        <TagImportResultStatus
                          statusKey={result.status}
                          statusLabel={importStatuses.find((st) => result.status === st.value)?.label ?? result.status}
                        />
                      </Table.Cell>
                      <Table.Cell>{formatDate(result.created)}</Table.Cell>
                      <Table.Cell>
                        {result?.extractionRecords?.filter((record) => record.extractResult?.issues.length === 0)
                          .length ?? 0}
                      </Table.Cell>
                      <Table.Cell>
                        {result?.extractionRecords
                          ?.filter((record) => !record.extractResult?.issues.some((issue) => issue.type === 'ERROR'))
                          ?.filter((record) => record.extractResult?.issues.some((issue) => issue.type === 'WARNING'))
                          .length ?? 0}
                      </Table.Cell>
                      <Table.Cell>
                        {result?.extractionRecords?.filter((record) =>
                          record.extractResult?.issues.some((issue) => issue.type === 'ERROR'),
                        ).length ?? 0}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : null
          }
          noSearchHits={!paginatedImportResults || paginatedImportResults.length === 0}
          paginationInfo={{
            currentPage: page ?? 0,
            totalPages: totalPages,
          }}
          onPageChange={(newPage) => {
            setPage(newPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </SearchHitsLayout.MainColumn>
    </SearchHitsLayout>
  );
};

export { ImportResults };
