'use client';
import { ReactNode } from 'react';
import styles from './search-hits-page-layout.module.css';

export interface SearchHitsPageLayoutProps {
  buttonRow?: ReactNode;
  searchRow?: ReactNode;
  leftColumn?: ReactNode;
  mainColumn?: ReactNode;
}

const SearchHitsPageLayout = ({ buttonRow, searchRow, leftColumn, mainColumn }: SearchHitsPageLayoutProps) => {
  return (
    <div className='container'>
      <div className={styles.pageContainer}>
        <div className={styles.secondRowContainer}>
          <div className={styles.buttonsContainer}>{buttonRow}</div>
        </div>

        <div className={styles.searchRowContainer}>{searchRow}</div>

        <div className={styles.gridContainer}>
          {leftColumn}
          {mainColumn}
        </div>
      </div>
    </div>
  );
};

export { SearchHitsPageLayout };
