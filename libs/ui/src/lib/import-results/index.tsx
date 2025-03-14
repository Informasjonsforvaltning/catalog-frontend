'use client';

import { ImportResult } from '@catalog-frontend/types';
import styles from './import-results.module.css';
import { Button, Chip, NativeSelect } from '@digdir/designsystemet-react';
import {
  capitalizeFirstLetter,
  formatISO,
  getTranslateText,
  sortDateStringsAscending,
  sortDateStringsDescending,
} from '@catalog-frontend/utils';
import { TagImportResultStatus } from '../tag';
import { SearchHit } from '../search-hit';
import { SearchHitContainer } from '../search-hit-container';
import { SearchHitsPageLayout } from '../search-hits-page-layout';
import React, { useEffect, useMemo, useState } from 'react';
import { parseAsArrayOf, parseAsString, parseAsInteger, useQueryState } from 'nuqs';
import { ImportFilter } from './components/import-filter';
import { isEmpty } from 'lodash';
import { TrashIcon } from '@navikt/aksel-icons';

const importStatuses = [
  { value: 'COMPLETED', label: 'Vellykket' },
  { value: 'FAILED', label: 'Feilet' },
];

interface Props {
  importHref: string;
  importResults: ImportResult[];
  deleteHandler: (resultId: string) => void;
}

const ImportResults = ({ importHref, importResults, deleteHandler }: Props) => {
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
    if (importResult.status === 'FAILED') {
      return 'Ingen vellykka importeringer';
    }

    if (importResult.extractionRecords?.length === 1) {
      return '1 vellykka import';
    }

    return `${importResult.extractionRecords?.length ?? 0} vellykka importeringer`;
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
    <SearchHitsPageLayout>
      <SearchHitsPageLayout.SearchRow>
        <NativeSelect
          size='sm'
          className={styles.select}
          onChange={handleSortChange}
        >
          <option value=''>Nyeste først</option>
          <option value='createdAsc'>Eldste først</option>
        </NativeSelect>
      </SearchHitsPageLayout.SearchRow>
      <SearchHitsPageLayout.LeftColumn>
        <FilterChips />
        <ImportFilter importStatuses={importStatuses} />
      </SearchHitsPageLayout.LeftColumn>
      <SearchHitsPageLayout.MainColumn>
        <SearchHitContainer
          searchHits={
            paginatedImportResults.length > 0
              ? paginatedImportResults.map((result: ImportResult) => (
                  <div
                    key={result.id}
                    className={styles.searchHit}
                  >
                    <SearchHit
                      title={importResultHitTitle(result)}
                      titleHref={`${importHref}/${result.id}`}
                      statusTag={
                        <div className={styles.set}>
                          <TagImportResultStatus
                            statusKey={result.status}
                            statusLabel={
                              importStatuses.find((st) => result.status === st.value)?.label ?? result.status
                            }
                          />
                          <p>{formatDate(result.created)}</p>
                        </div>
                      }
                      rightColumn={
                        <Button
                          variant='tertiary'
                          size='sm'
                          color='danger'
                          onClick={() => deleteHandler(result.id)}
                        >
                          <TrashIcon
                            title='Slett'
                            fontSize='1.5rem'
                          />
                          Slett
                        </Button>
                      }
                    />
                  </div>
                ))
              : null
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
      </SearchHitsPageLayout.MainColumn>
    </SearchHitsPageLayout>
  );
};

export { ImportResults };
