'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dataset, FilterType, PublicationStatus } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';
import { LinkButton, SearchHit, SearchHitContainer, SearchHitsPageLayout } from '@catalog-frontend/ui';
import { Chip, NativeSelect, Search } from '@digdir/designsystemet-react';
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
import { MagnifyingGlassIcon, PlusCircleIcon } from '@navikt/aksel-icons';
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
  const [searchTerm, setSearchTerm] = useQueryState('search');
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );
  const [sortValue, setSortValue] = useQueryState('sort');
  const [page, setPage] = useQueryState('page', parseAsInteger);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);
  const [searchValue, setSearchValue] = useState(searchTerm ?? '');

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
          return (a: Dataset, b: Dataset) => sortDateStringsDescending(a._lastModified || '', b._lastModified || '');
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
          if (filterStatus?.includes(PublicationStatus.APPROVE)) {
            return (
              dataset.registrationStatus === PublicationStatus.APPROVE ||
              dataset.registrationStatus === PublicationStatus.PUBLISH
            );
          }
          if (filterStatus?.includes(PublicationStatus.DRAFT)) {
            return dataset.registrationStatus === PublicationStatus.DRAFT;
          }
          return false;
        });
      }
      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((dataset) => {
          const status = filterPublicationState?.toString();
          return (
            dataset.registrationStatus === status ||
            (status === 'UNPUBLISH' && dataset.registrationStatus !== PublicationStatus.PUBLISH)
          );
        });
      }
      if (searchValue) {
        const lowercasedQuery = searchValue.toLowerCase();
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

  const onSearchSubmit = (search: string) => {
    setSearchTerm(search);
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
            onClick={() => {
              removeFilter(filter, 'status');
            }}
          >
            {getTranslateText(localization.datasetForm.filter[filter])}
          </Chip.Removable>
        ))}
        {filterPublicationState?.map((filter, index) => (
          <Chip.Removable
            key={`published-${index}`}
            onClick={() => {
              removeFilter(filter, 'published');
            }}
          >
            {filter === PublicationStatus.PUBLISH
              ? localization.publicationState.published
              : localization.publicationState.unpublished}
          </Chip.Removable>
        ))}
      </Chip.Group>
    </div>
  );

  const totalPages = Math.ceil(filteredDatasets.length / itemPerPage);

  const paginatedDatasets = useMemo(() => {
    const startIndex = page ? page * itemPerPage : 0;
    const endIndex = startIndex + itemPerPage;
    return filteredDatasets.slice(startIndex, endIndex);
  }, [filteredDatasets, page]);

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout>
        <SearchHitsPageLayout.SearchRow>
          <NativeSelect
            label={localization.search.sort}
            size='sm'
            className={styles.select}
            onChange={(val) => {
              setSortValue(val.target.value);
            }}
          >
            <option value=''>{`${localization.choose}...`}</option>
            <option value='lastChanged'>{localization.search.sortOptions.LAST_UPDATED_FIRST}</option>
            <option value='titleAsc'>{localization.search.sortOptions.TITLE_AÅ}</option>
            <option value='titleDesc'>{localization.search.sortOptions.TITLE_ÅA}</option>
          </NativeSelect>
        </SearchHitsPageLayout.SearchRow>
        {hasWritePermission && (
          <SearchHitsPageLayout.ButtonRow>
            <LinkButton
              variant='primary'
              href={`/catalogs/${catalogId}/datasets/new`}
            >
              <PlusCircleIcon fontSize='1.2rem' />
              {localization.datasetForm.button.addDataset}
            </LinkButton>
          </SearchHitsPageLayout.ButtonRow>
        )}
        <SearchHitsPageLayout.LeftColumn>
          <div className={styles.leftColumn}>
            <Search
              label={localization.search.search}
              size='sm'
              placeholder={localization.search.search}
              clearButtonLabel={localization.search.clear}
              searchButtonLabel={
                <MagnifyingGlassIcon
                  fontSize='1em'
                  title={localization.search.search}
                />
              }
              variant='primary'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.code === 'Enter' && onSearchSubmit(searchValue)}
              onSearchClick={onSearchSubmit}
              onClear={() => {
                setSearchValue('');
                onSearchSubmit('');
              }}
            />
            <FilterChips />
            <SearchFilter />
          </div>
        </SearchHitsPageLayout.LeftColumn>
        <SearchHitsPageLayout.MainColumn>
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
                        statusTag={<StatusTag datasetStatus={dataset.registrationStatus} />}
                        content={
                          <>
                            <div className={styles.set}>
                              <p>
                                {localization.lastChanged} {formatDate(dateStringToDate(dataset._lastModified))}
                              </p>
                              <span>•</span>
                              {dataset.registrationStatus === PublicationStatus.PUBLISH
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
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DatasetsPageClient;
