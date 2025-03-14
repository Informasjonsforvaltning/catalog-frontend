'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import { LinkButton, SearchHit, SearchHitContainer, SearchHitsPageLayout } from '@catalog-frontend/ui';
import SearchFilter from '../../../../components/search-filter';
import React, { useState, useEffect } from 'react';
import { Chip, NativeSelect, Search } from '@digdir/designsystemet-react';
import {
  capitalizeFirstLetter,
  dateStringToDate,
  formatDate,
  getTranslateText,
  localization,
  sortAscending,
  sortDateStringsDescending,
  sortDescending,
} from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { isEmpty } from 'lodash';
import StatusTag from '../../../../components/status-tag';
import ImportModal from '../../../../components/import-modal';

type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';
type FilterType = 'published' | 'status';

interface Props {
  dataServices: DataService[];
  catalogId: string;
  hasWritePermission: boolean;
  distributionStatuses: any;
}

const DataServicesPageClient = ({ dataServices, catalogId, hasWritePermission, distributionStatuses }: Props) => {
  const [filteredDataServices, setFilteredDataServices] = useState<DataService[]>(dataServices);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortTypes | ''>('');
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );

  const getSortFunction = (sortKey: SortTypes) => {
    switch (sortKey) {
      case 'titleAsc':
        return (a: DataService, b: DataService) =>
          sortAscending(getTranslateText(a.title)?.toString() || '', getTranslateText(b.title)?.toString() || '');
      case 'titleDesc':
        return (a: DataService, b: DataService) =>
          sortDescending(getTranslateText(a.title)?.toString() || '', getTranslateText(b.title)?.toString() || '');
      case 'lastChanged':
        return (a: DataService, b: DataService) => sortDateStringsDescending(a.modified || '', b.modified || '');
      default:
        return () => 0;
    }
  };

  useEffect(() => {
    const filteredDataServices = () => {
      let filtered = dataServices;

      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter((dataService) => dataService.status && filterStatus?.includes(dataService.status));
      }

      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((dataService) =>
          filterPublicationState?.includes(dataService?.published ? 'published' : 'unpublished'),
        );
      }

      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (dataService) =>
            getTranslateText(dataService.title).toString().toLowerCase().includes(lowercasedQuery) ||
            getTranslateText(dataService.description).toString().toLowerCase().includes(lowercasedQuery),
        );
      }

      if (sortType) {
        filtered = [...filtered].sort(getSortFunction(sortType));
      }

      setFilteredDataServices(filtered);
    };

    filteredDataServices();
  }, [dataServices, filterStatus, filterPublicationState, searchQuery, sortType]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value;
      handleSearch(value);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SortTypes;
    setSortType(value);
  };

  const removeFilter = (filterName, filterType: FilterType) => {
    switch (filterType) {
      case 'published':
        setFilterPublicationState(filterPublicationState?.filter((name) => name !== filterName) ?? []);
        break;
      case 'status':
        setFilterStatus(filterStatus?.filter((name) => name !== filterName) ?? []);
        break;
      default:
        break;
    }
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
            onClick={() => removeFilter(filter, 'status')}
          >
            {capitalizeFirstLetter(
              getTranslateText(distributionStatuses?.find((s) => s.uri === filter)?.label) as string,
            )}
          </Chip.Removable>
        ))}
        {filterPublicationState?.map((filter, index) => (
          <Chip.Removable
            key={`published-${index}`}
            onClick={() => removeFilter(filter, 'published')}
          >
            {filter === 'published'
              ? localization.publicationState.published
              : localization.publicationState.unpublished}
          </Chip.Removable>
        ))}
      </Chip.Group>
    </div>
  );

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout>
        <SearchHitsPageLayout.SearchRow>
          <NativeSelect
            label={localization.search.sort}
            size='sm'
            className={styles.select}
            onChange={handleSortChange}
          >
            <option value=''>{`${localization.choose}...`}</option>
            <option value='lastChanged'>{localization.search.sortOptions.LAST_UPDATED_FIRST}</option>
            <option value='titleAsc'>{localization.search.sortOptions.TITLE_AÅ}</option>
            <option value='titleDesc'>{localization.search.sortOptions.TITLE_ÅA}</option>
          </NativeSelect>
        </SearchHitsPageLayout.SearchRow>
        {hasWritePermission && (
          <SearchHitsPageLayout.ButtonRow>
            <ImportModal catalogId={catalogId} />
            <LinkButton href={`/catalogs/${catalogId}/data-services/new`}>
              <PlusCircleIcon />
              {localization.dataServiceCatalog.button.newDataService}
            </LinkButton>
          </SearchHitsPageLayout.ButtonRow>
        )}
        <SearchHitsPageLayout.LeftColumn>
          <Search
            variant='primary'
            placeholder={localization.search.search}
            onSearchClick={handleSearch}
            onKeyDown={handleSearchKeyDown}
          />
          <FilterChips />
          <SearchFilter distributionStatuses={distributionStatuses} />
        </SearchHitsPageLayout.LeftColumn>
        <SearchHitsPageLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              filteredDataServices.length > 0
                ? filteredDataServices.map((dataService: DataService) => (
                    <div
                      key={dataService.id}
                      className={styles.searchHit}
                    >
                      <SearchHit
                        title={getTranslateText(dataService?.title)}
                        description={getTranslateText(dataService?.description)}
                        titleHref={`/catalogs/${catalogId}/data-services/${dataService?.id}`}
                        statusTag={
                          <StatusTag
                            dataServiceStatus={dataService?.status}
                            distributionStatuses={distributionStatuses}
                            language={'nb'}
                          />
                        }
                        content={
                          <>
                            <div className={styles.set}>
                              <p>
                                {localization.lastChanged} {formatDate(dateStringToDate(dataService.modified ?? ''))}
                              </p>
                              <span>•</span>
                              {dataService.published
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
            noSearchHits={!filteredDataServices || filteredDataServices.length === 0}
          />
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DataServicesPageClient;
