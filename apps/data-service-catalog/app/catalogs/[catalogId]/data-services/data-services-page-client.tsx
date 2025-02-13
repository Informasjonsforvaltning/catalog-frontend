'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import {
  LinkButton,
  SearchHit,
  SearchHitContainer,
  SearchHitsPageLayout,
  Tag,
  DataServiceStatusTagProps,
} from '@catalog-frontend/ui';
import { StatusFilter } from '../../../../components/status-filter';
import React, { useState, useEffect } from 'react';
import { NativeSelect, Search } from '@digdir/designsystemet-react';
import {
  dateStringToDate,
  formatDate,
  getTranslateText,
  localization,
  sortAscending,
  sortDateStringsDescending,
  sortDescending,
} from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';

type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';

interface Props {
  dataServices: DataService[];
  catalogId: string;
  hasWritePermission: boolean;
  distributionStatuses: any;
}

const DataServicesPageClient = ({ dataServices, catalogId, hasWritePermission, distributionStatuses }: Props) => {
  const [filteredDataServices, setFilteredDataServices] = useState<DataService[]>(dataServices);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortType, setSortType] = useState<SortTypes | ''>('');

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

      if (selectedStatus !== 'ALL') {
        filtered = filtered.filter((dataService) => dataService.status === selectedStatus);
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
  }, [dataServices, selectedStatus, searchQuery, sortType]);

  const findDistributionStatus = (statusURI) => distributionStatuses?.find((s) => s.uri === statusURI);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

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
          <StatusFilter onStatusChange={handleStatusChange} />
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
                        titleHref={`/catalogs/${catalogId}/data-services/${dataService?.id}/edit`}
                        statusTag={
                          dataService.status && (
                            <Tag.DataServiceStatus
                              statusKey={
                                findDistributionStatus(dataService.status)
                                  ?.code as DataServiceStatusTagProps['statusKey']
                              }
                              statusLabel={
                                getTranslateText(findDistributionStatus(dataService.status)?.label) as string
                              }
                            />
                          )
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
