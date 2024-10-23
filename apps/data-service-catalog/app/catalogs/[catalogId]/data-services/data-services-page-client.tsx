'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import { SearchHitsPageLayout } from '@catalog-frontend/ui';
import { SearchHitTable } from '../../../../components/search-hit-table';
import React, { useState, useEffect } from "react";
import {Paragraph, Search} from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";

interface Props {
  dataServices: DataService[];
  hasWritePermission: boolean;
}

const DataServicesPageClient = ({ dataServices }: Props) => {
  const [filteredDataServices, setFilteredDataServices] = useState<DataService[]>(dataServices);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const filteredDataServices = () => {
      let filtered = dataServices;

      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
            (dataService) =>
                dataService.title?.nb?.toLowerCase().includes(lowercasedQuery) ||
                dataService.description?.nb?.toLowerCase().includes(lowercasedQuery),
        );
      }

      setFilteredDataServices(filtered);
    };

    filteredDataServices();
  }, [dataServices, searchQuery]);

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
        <SearchHitsPageLayout.SearchRow>
          <div className={styles.searchContainer}>
            <div className={styles.search}>
              <Paragraph>{localization.dataServiceCatalog.searchDataService}</Paragraph>
              <Search
                  variant='primary'
                  placeholder={localization.search.search}
                  onSearchClick={handleSearch}
                  onKeyDown={handleSearchKeyDown}
              />
            </div>
          </div>
        </SearchHitsPageLayout.SearchRow>
        <SearchHitsPageLayout.LeftColumn>
          <div className={styles.leftColumn}></div>
        </SearchHitsPageLayout.LeftColumn>
        <SearchHitsPageLayout.MainColumn>
          <SearchHitTable dataServices={filteredDataServices}/>
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DataServicesPageClient;
