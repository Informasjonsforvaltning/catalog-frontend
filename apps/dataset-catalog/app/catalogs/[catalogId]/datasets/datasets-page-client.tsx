'use client';

import React, { useState, useEffect } from 'react';
import { Dataset } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';

import { SearchHitsPageLayout, Select } from '@catalog-frontend/ui';
import { SearchHitTable } from '../../../../components/search-hit-table';
import { Filter } from '../../../../components/filter';
import { Paragraph, Search } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
}

const DatasetsPageClient = ({ datasets }: Props) => {
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    const filterDatasets = () => {
      let filtered = datasets;

      if (selectedStatus !== 'ALL') {
        filtered = filtered.filter((dataset) => dataset.registrationStatus === selectedStatus);
      }

      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            dataset.title?.nb?.toLowerCase().includes(lowercasedQuery) ||
            dataset.description?.nb?.toLowerCase().includes(lowercasedQuery),
        );
      }

      setFilteredDatasets(filtered);
    };

    filterDatasets();
  }, [datasets, selectedStatus, searchQuery]);

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (typeof window !== 'undefined') {
      if (selectedValue === 'dataset') {
        window.location.href = '/catalogs/974760673/datasets/new';
      } else if (selectedValue === 'datasetSeries') {
        window.location.href = '/catalogs/974760673/datasets/series/new';
      }
    }
  };

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout>
        <SearchHitsPageLayout.SearchRow>
          <div className={styles.searchContainer}>
            <div className={styles.search}>
              <Paragraph>{localization.datasetCatalog.searchDataset}</Paragraph>
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
          <div className={styles.leftColumn}>
            <div>
              <Paragraph>Legg til...</Paragraph>
              <Select onChange={handleSelectChange}>
                <option value='blank'>{`${localization.choose}...`}</option>
                <option value='dataset'>{localization.resourceType.dataset}</option>
                <option value='datasetSeries'>{localization.resourceType.datasetSeries}</option>
              </Select>
            </div>

            <Filter onStatusChange={handleStatusChange} />
          </div>
        </SearchHitsPageLayout.LeftColumn>

        <SearchHitsPageLayout.MainColumn>
          <SearchHitTable datasets={filteredDatasets} />
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DatasetsPageClient;
