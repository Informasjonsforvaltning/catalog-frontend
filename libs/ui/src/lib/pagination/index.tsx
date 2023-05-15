import {ArrowLeftIcon, ArrowRightIcon} from '@navikt/aksel-icons';
import ReactPaginate from 'react-paginate';
import styles from './pagination.module.css';

export const Pagination = ({...rest}) => (
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

export default Pagination;
