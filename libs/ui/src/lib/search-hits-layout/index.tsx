'use client';

import { HTMLAttributes, ReactNode, Children, isValidElement } from 'react';
import styles from './search-hits-layout.module.css';

interface SearchHitsPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const SearchHitsLayout = ({ children }: SearchHitsPageLayoutProps) => {
  const childrenArray = Children.toArray(children);
  const leftChild = childrenArray.find((child) => isValidElement(child) && child.type === SearchHitsLayout.LeftColumn);
  const mainChild = childrenArray.find((child) => isValidElement(child) && child.type === SearchHitsLayout.MainColumn);
  const searchRowChild = childrenArray.find(
    (child) => isValidElement(child) && child.type === SearchHitsLayout.SearchRow,
  );

  return (
    <div className='container'>
      <div className={styles.pageContainer}>
        {searchRowChild && <div className={styles.searchRowContainer}>{searchRowChild}</div>}
        <div className={styles.gridContainer}>
          {leftChild}
          {mainChild}
        </div>
      </div>
    </div>
  );
};

const LeftColumn = ({ children }: { children: ReactNode }) => <div className={styles.leftColumn}>{children}</div>;

const MainColumn = ({ children }: { children: ReactNode }) => <div className={styles.mainColumn}>{children}</div>;

const SearchRow = ({ children }: { children: ReactNode }) => <>{children}</>;

SearchHitsLayout.LeftColumn = LeftColumn;
SearchHitsLayout.MainColumn = MainColumn;
SearchHitsLayout.SearchRow = SearchRow;

export { SearchHitsLayout };
