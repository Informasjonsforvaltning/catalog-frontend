'use client';

import { Pagination as DSPagination } from '@digdir/designsystemet-react';
import cn from 'classnames';
import styles from './pagination.module.css';

interface Props {
  onChange(selectedItem: number): void;
  totalPages: number;
  currentPage: number;
  className?: string;
}

const Pagination = ({ onChange, totalPages, currentPage, className }: Props) => (
  <DSPagination
    className={cn(className, styles.paginationContainer)}
    currentPage={currentPage}
    totalPages={totalPages}
    onChange={onChange}
    nextLabel='Neste'
    previousLabel='Forrige'
    itemLabel={(num) => `Side ${num}}`}
    data-size='sm'
    compact={false}
  />
);

export { Pagination };
