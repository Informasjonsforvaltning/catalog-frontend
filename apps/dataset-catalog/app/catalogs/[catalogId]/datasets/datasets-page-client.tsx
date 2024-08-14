'use client';
import React, { useState } from 'react';
import { Dataset } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';

import { SearchHitsPageLayout } from '@catalog-frontend/ui';
import { SearchHitTable } from '../../../../components/search-hit-table';
import { Filter } from '../../../../components/filter';

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
}

const DatasetsPageClient = ({ datasets }: Props) => {
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);

  const filterStatuses = (status: string) => {
    if (status === 'ALL') {
      setFilteredDatasets(datasets);
    } else {
      const filtered = datasets.filter((dataset) => dataset.registrationStatus === status);
      setFilteredDatasets(filtered);
    }
  };

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout
        leftColumn={
          <div>
            <Filter onStatusChange={filterStatuses} />
          </div>
        }
        mainColumn={<SearchHitTable datasets={filteredDatasets} />}
      />
    </div>
  );
};

export default DatasetsPageClient;
