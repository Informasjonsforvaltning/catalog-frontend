'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import { LinkButton, SearchHitsPageLayout } from '@catalog-frontend/ui';
import { SearchHitTable } from '../../../../components/search-hit-table';
import { StatusFilter } from '../../../../components/status-filter';
import React, { useState, useEffect } from 'react';
import { Search } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';

interface Props {
  dataServices: DataService[];
  catalogId: string;
  hasWritePermission: boolean;
}

const DataServicesPageClient = ({ dataServices, catalogId, hasWritePermission }: Props) => {
  const [filteredDataServices, setFilteredDataServices] = useState<DataService[]>(dataServices);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

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

      setFilteredDataServices(filtered);
    };

    filteredDataServices();
  }, [dataServices, selectedStatus, searchQuery]);

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

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout>
        <SearchHitsPageLayout.ButtonRow>
          {hasWritePermission && (
            <div>
              <LinkButton href={`/catalogs/${catalogId}/data-services/new`}>
                <PlusCircleIcon />
                {localization.dataServiceCatalog.button.newDataService}
              </LinkButton>
            </div>
          )}
        </SearchHitsPageLayout.ButtonRow>
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
          <SearchHitTable dataServices={filteredDataServices} />
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DataServicesPageClient;
