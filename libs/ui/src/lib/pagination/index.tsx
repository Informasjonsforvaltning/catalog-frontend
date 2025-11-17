'use client';

import {
  Pagination as DSPagination,
  usePagination,
  type PaginationProps as DSPaginationProps,
} from '@digdir/designsystemet-react';
import type { MouseEvent } from 'react';
import cn from 'classnames';
import styles from './pagination.module.css';

interface Props extends Omit<DSPaginationProps, 'className' | 'aria-label' | 'onChange'> {
  onChange?: (event: MouseEvent<HTMLElement>, page: number) => void;
  totalPages: number;
  currentPage: number;
  className?: string;
  showPages?: number;
}

const Pagination = ({
  onChange,
  totalPages,
  currentPage,
  className,
  showPages = 7,
  ...rest
}: Props) => {
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage,
    totalPages,
    showPages,
    onChange,
  });

  return (
    <DSPagination
      className={cn(className, styles.paginationContainer)}
      aria-label='Sidenavigering'
      {...rest}
    >
      <DSPagination.List>
        <DSPagination.Item>
          <DSPagination.Button aria-label='Forrige side' {...prevButtonProps}>
            Forrige
          </DSPagination.Button>
        </DSPagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <DSPagination.Item key={itemKey}>
            {typeof page === 'number' ? (
              <DSPagination.Button aria-label={`Side ${page}`} {...buttonProps}>
                {page}
              </DSPagination.Button>
            ) : null}
          </DSPagination.Item>
        ))}
        <DSPagination.Item>
          <DSPagination.Button aria-label='Neste side' {...nextButtonProps}>
            Neste
          </DSPagination.Button>
        </DSPagination.Item>
      </DSPagination.List>
    </DSPagination>
  );
};

export { Pagination };
