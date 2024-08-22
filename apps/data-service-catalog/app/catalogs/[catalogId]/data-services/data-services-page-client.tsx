'use client';

import { DataService } from '@catalog-frontend/types';
import styles from './data-services-page.module.css';

import { SearchHitsPageLayout } from '@catalog-frontend/ui';
import { SearchHitTable } from '../../../../components/search-hit-table';

interface Props {
  dataServices: DataService[];
  hasWritePermission: boolean;
}

const DataServicesPageClient = ({ dataServices }: Props) => {
  return (
    <div className={styles.container}>
      <SearchHitsPageLayout>
        <SearchHitsPageLayout.SearchRow>
          <div className={styles.searchContainer}></div>
        </SearchHitsPageLayout.SearchRow>
        <SearchHitsPageLayout.LeftColumn>
          <div className={styles.leftColumn}></div>
        </SearchHitsPageLayout.LeftColumn>
        <SearchHitsPageLayout.MainColumn>
          <SearchHitTable dataServices={dataServices} />
        </SearchHitsPageLayout.MainColumn>
      </SearchHitsPageLayout>
    </div>
  );
};

export default DataServicesPageClient;
