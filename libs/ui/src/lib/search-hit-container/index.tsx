import { localization } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';
import { Pagination } from '../pagination';
import { ReactNode } from 'react';

type Props = {
  onPageChange?(selectedItem: number): void;
  searchHits: ReactNode | undefined;
  paginationInfo?: PaginationInfo;
  noSearchHits: boolean;
};

type PaginationInfo = {
  totalPages: number;
  currentPage: number;
};

const SearchHitContainer = ({ onPageChange, searchHits, paginationInfo, noSearchHits }: Props) => {
  return (
    <div className={styles.searchHitsContainer}>
      {(noSearchHits || noSearchHits === undefined) && (
        <div className={styles.noHits}>{localization.search.noHits}</div>
      )}
      {searchHits}
      {!noSearchHits && paginationInfo && onPageChange && (
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
