'use client';

import { Pagination as DSPagination } from '@digdir/design-system-react';
import styles from './pagination.module.css';

interface Props {
  onPageChange(selectedItem: { selected: number }): void;
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ onPageChange, totalPages, currentPage }: Props) => {
  const handleOnChange = (selectedItem: number) => {
    onPageChange({ selected: selectedItem - 1 });
  };

  return (
    <DSPagination
      className={styles.paginationContainer}
      currentPage={currentPage + 1}
      totalPages={totalPages}
      onChange={handleOnChange}
      nextLabel='Neste'
      previousLabel='Forrige'
      itemLabel={(num) => `Side ${num}}`}
      size='small'
      compact={true}
    />
  );
};

export { Pagination };
