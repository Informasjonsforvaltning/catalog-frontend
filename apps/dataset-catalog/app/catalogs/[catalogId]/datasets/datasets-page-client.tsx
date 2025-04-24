'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dataset, FilterType } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';
import { LinkButton, SearchField, SearchHit, SearchHitContainer, SearchHitsLayout } from '@catalog-frontend/ui';
import { Chip, NativeSelect } from '@digdir/designsystemet-react';
import {
  dateStringToDate,
  formatDate,
  getTranslateText,
  localization,
  sortAscending,
  sortDateStringsDescending,
  sortDescending,
} from '@catalog-frontend/utils';
import StatusTag from '../../../../components/status-tag/index';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import SearchFilter from '../../../../components/search-filter';
import { isEmpty } from 'lodash';
import { useQueryState, parseAsArrayOf, parseAsString, parseAsInteger } from 'nuqs';

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
  catalogId: string;
}

type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';
const sortTypes: SortTypes[] = ['titleAsc', 'titleDesc', 'lastChanged'];
const itemPerPage = 5;

const DatasetsPageClient = ({ datasets, catalogId, hasWritePermission }: Props) => {
  const [searchTerm, setSearchTerm] = useQueryState('search', { defaultValue: '' });
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );
  const [sortValue, setSortValue] = useQueryState('sort');
  const [page, setPage] = useQueryState('page', parseAsInteger);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);

  const getSortFunction = useMemo(() => {
    return (sortKey: SortTypes) => {
      switch (sortKey) {
        case 'titleAsc':
          return (a: Dataset, b: Dataset) =>
            sortAscending(getTranslateText(a.title)?.toString() || '', getTranslateText(b.title)?.toString() || '');
        case 'titleDesc':
          return (a: Dataset, b: Dataset) =>
            sortDescending(getTranslateText(a.title)?.toString() || '', getTranslateText(b.title)?.toString() || '');
        case 'lastChanged':
          return (a: Dataset, b: Dataset) => sortDateStringsDescending(a.lastModified || '', b.lastModified || '');
        default:
          return () => 0;
      }
    };
  }, []);

  const removeFilter = (filterName: string, filterType: FilterType) => {
    if (filterType === 'published') {
      setFilterPublicationState(filterPublicationState?.filter((name) => name !== filterName) ?? []);
    } else if (filterType === 'status') {
      setFilterStatus(filterStatus?.filter((name) => name !== filterName) ?? []);
    }
  };

  useEffect(() => {
    const filterAndSortDatasets = () => {
      let filtered = datasets;
      setPage(0);

      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter((dataset) => {
          if (filterStatus?.includes('APPROVED')) {
            return dataset.approved;
          }
          if (filterStatus?.includes('NOT_APPROVED')) {
            return !dataset.approved;
          }
          return false;
        });
      }

      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((dataset) => {
          if (filterPublicationState?.includes('PUBLISHED')) {
            return dataset.published;
          }
          if (filterPublicationState?.includes('UNPUBLISHED')) {
            return !dataset.published;
          }
          return false;
        });
      }

      if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            getTranslateText(dataset?.title).toString().toLowerCase().includes(lowercasedQuery) ||
            getTranslateText(dataset?.description).toString().toLowerCase().includes(lowercasedQuery),
        );
      }

      const sort: SortTypes | '' = sortTypes.includes(sortValue as SortTypes) ? (sortValue as SortTypes) : '';
      if (sort) {
        filtered = [...filtered].sort(getSortFunction(sort));
      }

      setFilteredDatasets(filtered);
    };

    filterAndSortDatasets();
  }, [datasets, filterPublicationState, filterStatus, searchTerm, sortValue]);

  const FilterChips = () => {
    if (isEmpty(filterStatus) && isEmpty(filterPublicationState)) {
      return undefined;
    }

    return (
      <div className={styles.chips}>
        <Chip.Group
          size='small'
          className={styles.wrap}
        >
          {filterStatus?.map((filter, index) => (
            <Chip.Removable
              key={`status-${index}`}
              onClick={() => {
                removeFilter(filter, 'status');
              }}
            >
              {filter === 'APPROVED'
                ? localization.datasetForm.filter.APPROVED
                : localization.datasetForm.filter.NOT_APPROVED}
            </Chip.Removable>
          ))}
          {filterPublicationState?.map((filter, index) => (
            <Chip.Removable
              key={`published-${index}`}
              onClick={() => {
                removeFilter(filter, 'published');
              }}
            >
              {filter === 'PUBLISHED'
                ? localization.publicationState.published
                : localization.publicationState.unpublished}
            </Chip.Removable>
          ))}
        </Chip.Group>
      </div>
    );
  };

  const totalPages = Math.ceil(filteredDatasets.length / itemPerPage);

  const paginatedDatasets = useMemo(() => {
    const startIndex = page ? page * itemPerPage : 0;
    const endIndex = startIndex + itemPerPage;
    return filteredDatasets.slice(startIndex, endIndex);
  }, [filteredDatasets, page]);

  return (
    <div className={styles.container}>
      <SearchHitsLayout>
        <SearchHitsLayout.SearchRow>
          <div className={styles.searchRow}>
            <div className={styles.searchFieldWrapper}>
              <SearchField
                className={styles.searchField}
                placeholder={`${localization.search.search}...`}
                value={searchTerm}
                onSearch={(value) => {
                  setSearchTerm(value);
                }}
              />
              <NativeSelect
                size='sm'
                className={styles.select}
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option value=''>{`${localization.choose} ${localization.search.sort.toLowerCase()}...`}</option>
                <option value='lastChanged'>{localization.search.sortOptions.LAST_UPDATED_FIRST}</option>
                <option value='titleAsc'>{localization.search.sortOptions.TITLE_AÅ}</option>
                <option value='titleDesc'>{localization.search.sortOptions.TITLE_ÅA}</option>
              </NativeSelect>
            </div>
            <div className={styles.buttons}>
              {hasWritePermission && (
                <>
                  <LinkButton
                    variant='primary'
                    href={`/catalogs/${catalogId}/datasets/new`}
                  >
                    <PlusCircleIcon fontSize='1.2rem' />
                    {localization.datasetForm.button.addDataset}
                  </LinkButton>
                </>
              )}
            </div>
          </div>
          <FilterChips />
        </SearchHitsLayout.SearchRow>

        <SearchHitsLayout.LeftColumn>
          <div className={styles.leftColumn}>
            <SearchFilter />
          </div>
        </SearchHitsLayout.LeftColumn>

        <SearchHitsLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              paginatedDatasets.length > 0
                ? paginatedDatasets.map((dataset: Dataset) => (
                    <div
                      key={dataset.id}
                      className={styles.searchHit}
                    >
                      <SearchHit
                        title={getTranslateText(dataset?.title)}
                        description={getTranslateText(dataset?.description)}
                        titleHref={`/catalogs/${catalogId}/datasets/${dataset?.id}`}
                        statusTag={<StatusTag approved={dataset.approved} />}
                        content={
                          <>
                            <div className={styles.set}>
                              <p>
                                {localization.lastChanged} {formatDate(dateStringToDate(dataset.lastModified))}
                              </p>
                              <span>•</span>
                              {dataset.published
                                ? localization.publicationState.publishedInFDK
                                : localization.publicationState.unpublished}
                            </div>
                          </>
                        }
                      />
                    </div>
                  ))
                : null
            }
            noSearchHits={!paginatedDatasets || paginatedDatasets.length === 0}
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
    </div>
  );
};

export default DatasetsPageClient;
