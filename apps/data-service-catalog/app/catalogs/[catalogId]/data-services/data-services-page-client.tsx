'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import { LinkButton, SearchField, SearchHit, SearchHitContainer, SearchHitsLayout, Select } from '@catalog-frontend/ui';
import SearchFilter from '../../../../components/search-filter';
import React, { useState, useEffect } from 'react';
import { Chip } from '@digdir/designsystemet-react';
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
import StatusTag from '../../../../components/status-tag';
import { isEmpty } from 'lodash';
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
  const [filterStatus, setFilterStatus] = useQueryState('dataServiceFilter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'dataServiceFilter.pubState',
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
      <SearchHitsLayout>
        <SearchHitsLayout.SearchRow>
          <div className={styles.searchRow}>
            <div className={styles.searchFieldWrapper}>
              <SearchField
                className={styles.searchField}
                placeholder={localization.search.search}
                value={searchQuery}
                onSearch={(value) => setSearchQuery(value)}
              />
              <Select
                size='sm'
                onChange={(e) => setSortType(e.target.value as SortTypes)}
                value={sortType}
              >
                <option value=''>{`${localization.choose}...`}</option>
                <option value='lastChanged'>{localization.search.sortOptions.LAST_UPDATED_FIRST}</option>
                <option value='titleAsc'>{localization.search.sortOptions.TITLE_AÅ}</option>
                <option value='titleDesc'>{localization.search.sortOptions.TITLE_ÅA}</option>
              </Select>
            </div>
            <div className={styles.buttons}>
              {hasWritePermission && (
                <>
                  <ImportModal catalogId={catalogId} />
                  <LinkButton href={`/catalogs/${catalogId}/data-services/new`}>
                    <PlusCircleIcon />
                    {localization.dataServiceCatalog.button.newDataService}
                  </LinkButton>
                </>
              )}
            </div>
          </div>
          <FilterChips />
        </SearchHitsLayout.SearchRow>
        <SearchHitsLayout.LeftColumn>
          <SearchFilter distributionStatuses={distributionStatuses} />
        </SearchHitsLayout.LeftColumn>
        <SearchHitsLayout.MainColumn>
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
        </SearchHitsLayout.MainColumn>
      </SearchHitsLayout>
    </div>
  );
};

export default DataServicesPageClient;
