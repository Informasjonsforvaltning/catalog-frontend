'use client';
import React from 'react';

import { ReferenceDataCode, Dataset } from '@catalog-frontend/types';
import styles from './datasets-page.module.css';

import { SearchHitsPageLayout, Select } from '@catalog-frontend/ui';
import { SearchHitTable } from 'apps/dataset-catalog/components/search-hit-table';

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
  catalogId: string;
  statuses: ReferenceDataCode[];
}

const DatasetsPageClient = ({ datasets }: Props) => {
  console.log(datasets);

  return (
    <div className={styles.container}>
      <SearchHitsPageLayout
        leftColumn={<Select />}
        mainColumn={<SearchHitTable datasets={datasets} />}
      />
    </div>
  );
};

export default DatasetsPageClient;
