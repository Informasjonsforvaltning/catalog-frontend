import { localization as loc } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';
import { Pagination } from '../pagination';
import { ReactNode } from 'react';

type Props = {
  onPageChange(selectedItem: number): void;
  searchHits: ReactNode | undefined;
  paginationInfo?: any;
  noSearchHits: boolean;
};

const SearchHitContainer = ({ onPageChange, searchHits, paginationInfo, noSearchHits }: Props) => {
  return (
    <div className={styles.searchHitsContainer}>
      {noSearchHits && <div className={styles.noHits}>{loc.search.noHits}</div>}
      {searchHits}
      {!noSearchHits && paginationInfo && (
        <Pagination
          onChange={onPageChange}
          totalPages={paginationInfo.totalPages}
          currentPage={paginationInfo.currentPage + 1}
        />
      )}
    </div>
  );
};

export { SearchHitContainer };
