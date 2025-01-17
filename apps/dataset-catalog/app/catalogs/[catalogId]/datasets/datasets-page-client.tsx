'use client';

import React, { useState, useEffect } from 'react';
import { Dataset, PublicationStatus, SpecializedType } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';

import { LinkButton, SearchHit, SearchHitContainer, SearchHitsPageLayout } from '@catalog-frontend/ui';
import { Filter } from '../../../../components/filter';
import { Accordion, NativeSelect, Search } from '@digdir/designsystemet-react';
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

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
  catalogId: string;
}

type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';

const DatasetsPageClient = ({ datasets, catalogId }: Props) => {
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortType, setSortType] = useState<SortTypes | ''>('');

  const getSortFunction = (sortKey: SortTypes) => {
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

  useEffect(() => {
    const filterAndSortDatasets = () => {
      let filtered = datasets;

      if (selectedStatus !== 'ALL') {
        filtered = filtered.filter((dataset) => dataset.registrationStatus === selectedStatus);
      }

      if (selectedType !== 'ALL') {
        if (selectedType === SpecializedType.SERIES) {
          filtered = filtered.filter((dataset) => dataset?.specializedType === SpecializedType.SERIES);
        } else if (selectedType === 'DATASET') {
          filtered = filtered.filter((dataset) => dataset?.specializedType !== SpecializedType.SERIES);
        }
      }

      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            getTranslateText(dataset?.title).toString().toLowerCase().includes(lowercasedQuery) ||
            getTranslateText(dataset?.description).toString().toLowerCase().includes(lowercasedQuery),
        );
      }

      if (sortType) {
        filtered = [...filtered].sort(getSortFunction(sortType));
      }

      setFilteredDatasets(filtered);
    };

    filterAndSortDatasets();
  }, [datasets, selectedStatus, selectedType, searchQuery, sortType]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
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
        <SearchHitsPageLayout.ButtonRow>
          <LinkButton
            variant='primary'
            href={`/catalogs/${catalogId}/datasets/new`}
          >
            <PlusCircleIcon fontSize='1.2rem' />
            {localization.datasetForm.button.addDataset}
          </LinkButton>
          <LinkButton
            variant='secondary'
            href={`/catalogs/${catalogId}/datasets/series/new`}
          >
            <PlusCircleIcon fontSize='1.2rem' />
            {localization.datasetForm.button.addDatasetSeries}
          </LinkButton>
        </SearchHitsPageLayout.ButtonRow>
        <SearchHitsPageLayout.LeftColumn>
          <div className={styles.leftColumn}>
            <Search
              searchButtonLabel={<MagnifyingGlassIcon title='Search' />}
              placeholder={`${localization.search.search}...`}
              onSearchClick={handleSearch}
              onKeyDown={handleSearchKeyDown}
              variant='primary'
              size='sm'
              label={localization.search.searchForDataset}
            />
            <Accordion border>
              <Accordion.Item>
                <Accordion.Header level={2}>{localization.status}</Accordion.Header>
                <Accordion.Content>
                  <Filter
                    onStatusChange={handleStatusChange}
                    values={[PublicationStatus.APPROVE, PublicationStatus.DRAFT, PublicationStatus.PUBLISH]}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header level={2}>{localization.type}</Accordion.Header>
                <Accordion.Content>
                  <Filter
                    onStatusChange={handleTypeChange}
                    values={['DATASET', SpecializedType.SERIES]}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </SearchHitsPageLayout.LeftColumn>

        <SearchHitsPageLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              filteredDatasets.length > 0
                ? filteredDatasets.map((dataset: Dataset) => (
                    <div
                      key={dataset.id}
                      className={styles.searchHit}
                    >
                      <SearchHit
                        title={getTranslateText(dataset?.title)}
                        description={getTranslateText(dataset?.description)}
                        titleHref={`/catalogs/${catalogId}/datasets/${dataset?.id}`}
                        statusTag={<StatusTag datasetStatus={dataset.registrationStatus} />}
                        conceptSubject={
                          <p className={styles.greyFont}>
                            {dataset?.specializedType === SpecializedType.SERIES ? 'Datasettserie' : 'Datasett'}
                          </p>
                        }
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
            noSearchHits={!filteredDatasets || filteredDatasets.length === 0}
          />
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DatasetsPageClient;
