import {Breadcrumbs, breadcrumbT, SearchHit} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/search-page';
import styles from './pagination.module.css';
import {ArrowLeftIcon, ArrowRightIcon} from '@navikt/aksel-icons';
import ReactPaginate from 'react-paginate';
import {useRouter} from 'next/router';
import {SearchField} from '@catalog-frontend/ui';
import {PageBanner} from '@catalog-frontend/ui';
import {ConceptHitPageProps} from '@catalog-frontend/types';
import {useEffect, useState} from 'react';

export const SearchPage = () => {
  const [page, setPage] = useState<ConceptHitPageProps>();
  const [concepts, setConcepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [catalogId] = router.query.catalogId ?? '';
  const pageSubtitle = catalogId ?? 'No title';
  const [pageNumb, setPageNum] = useState(1);

  // initial page data population
  useEffect(() => {
    const init = () =>
      updatePage(catalogId, searchTerm, pageNumb).then((data) => {
        if (data) {
          setConcepts(data.hits);
          setPage(data.page);
        }
      });
    init();
  }, []);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  const changePage = async (currentPage) => {
    router.push({
      pathname: catalogId,
      query: {page: currentPage.selected + 1},
    });

    const data = await updatePage(catalogId, searchTerm, currentPage);

    if (data) {
      setConcepts(data.hits);
      setPage(data.page);
      setPageNum(currentPage.selected + 1);
    }
  };

  const onSearchSubmit = async (term = searchTerm) => {
    const data = await updatePage(catalogId, term, page.currentPage);

    if (data) {
      setConcepts(data.hits);
      setPage(data.page);
      setSearchTerm(term);
    }
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <SC.SearchPage>
        <SearchField
          ariaLabel={localization.search.searchInAllFields}
          placeholder={localization.search.searchInAllFields}
          onSearchSubmit={onSearchSubmit}
        />
        <SC.ContainerOne>
          <div>
            {concepts &&
              concepts.map((concept) => (
                <SC.SearchHitContainer key={concept.id}>
                  <SearchHit searchHit={concept} />
                </SC.SearchHitContainer>
              ))}
            <ReactPaginate
              onPageChange={changePage}
              forcePage={pageNumb - 1}
              pageCount={page ? page.totalPages : 0}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              previousLabel={<ArrowLeftIcon />}
              nextLabel={<ArrowRightIcon />}
              breakLabel="..."
              pageLinkClassName={styles.pageLink}
              containerClassName={styles.paginationContainer}
              activeClassName={styles.active}
              previousClassName={styles.arrowIcon}
              nextClassName={styles.arrowIcon}
            />
          </div>
        </SC.ContainerOne>
      </SC.SearchPage>
    </>
  );
};

const updatePage = async (catalogId, searchTerm, currentPage) => {
  const body = JSON.stringify({
    catalogId,
    query: {
      query: searchTerm,
      pagination: {page: currentPage.selected + 1, size: 5},
    },
  });

  const res = await fetch('/api/search', {
    method: 'POST',
    body: body,
  });

  const data = await res.json();
  return data;
};

export default SearchPage;
