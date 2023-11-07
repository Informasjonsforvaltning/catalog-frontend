'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import styles from './pagination.module.css';
const Pagination = ({ ...rest }: ReactPaginateProps) => (
  <ReactPaginate
    {...rest}
    pageCount={rest.pageCount}
    previousLabel={<ArrowLeftIcon />}
    nextLabel={<ArrowRightIcon />}
    breakLabel='...'
    marginPagesDisplayed={1}
    pageRangeDisplayed={2}
    pageLinkClassName={styles.pageLink}
    containerClassName={styles.paginationContainer}
    activeClassName={styles.active}
    previousClassName={styles.arrowIcon}
    nextClassName={styles.arrowIcon}
  />
);

export { Pagination };
