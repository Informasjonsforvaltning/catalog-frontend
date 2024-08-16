'use client';

import { HTMLAttributes, ReactNode, Children, isValidElement } from 'react';
import styles from './search-hits-page-layout.module.css';
import cn from 'classnames';

interface SearchHitsPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const SearchHitsPageLayout = ({ children }: SearchHitsPageLayoutProps) => {
  const childrenArray = Children.toArray(children);
  const leftChild = childrenArray.find(
    (child) => isValidElement(child) && child.type === SearchHitsPageLayout.LeftColumn,
  );
  const mainChild = childrenArray.find(
    (child) => isValidElement(child) && child.type === SearchHitsPageLayout.MainColumn,
  );
  const buttonRowChild = childrenArray.find(
    (child) => isValidElement(child) && child.type === SearchHitsPageLayout.ButtonRow,
  );
  const searchRowChild = childrenArray.find(
    (child) => isValidElement(child) && child.type === SearchHitsPageLayout.SearchRow,
  );

  return (
    <div className='container'>
      <div className={styles.pageContainer}>
        <div className={styles.secondRowContainer}>
          <div className={styles.buttonsContainer}>{buttonRowChild}</div>
        </div>

        <div className={styles.searchRowContainer}>{searchRowChild}</div>

        <div className={cn(styles.gridContainer)}>
          {leftChild}
          {mainChild}
        </div>
      </div>
    </div>
  );
};

const LeftColumn = ({ children }: { children: ReactNode }) => <div className={styles.leftColumn}>{children}</div>;

const MainColumn = ({ children }: { children: ReactNode }) => <div className={styles.mainColumn}>{children}</div>;

const ButtonRow = ({ children }: { children: ReactNode }) => <>{children}</>;

const SearchRow = ({ children }: { children: ReactNode }) => <>{children}</>;

SearchHitsPageLayout.LeftColumn = LeftColumn;
SearchHitsPageLayout.MainColumn = MainColumn;
SearchHitsPageLayout.ButtonRow = ButtonRow;
SearchHitsPageLayout.SearchRow = SearchRow;

export { SearchHitsPageLayout };
