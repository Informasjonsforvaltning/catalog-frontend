import {getServerSession} from 'next-auth/next';
import {Breadcrumbs, breadcrumbT, SearchHit} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/search-page';
import styles from './pagination.module.css';
import {ArrowLeftIcon, ArrowRightIcon} from '@navikt/aksel-icons';
import {GetServerSideProps} from 'next';
import {authOptions} from '../api/auth/[...nextauth]';
import {searchConceptsForCatalog} from '@catalog-frontend/data-access';
import ReactPaginate from 'react-paginate';
import {useRouter} from 'next/router';
import {PageBanner} from '@catalog-frontend/ui';
import {SearchConceptResponse} from '@catalog-frontend/types';

interface SearchPageProps {
  accessToken: string;
  catalogId: string;
  searchConceptResponse: SearchConceptResponse;
  pageNumb: number;
}

export const SearchPage = ({
  catalogId,
  searchConceptResponse,
  pageNumb,
}: SearchPageProps) => {
  const router = useRouter();
  const pageSubtitle = catalogId ?? 'No title';
  const {page, hits: concepts} = searchConceptResponse;

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  const changePage = (currentPage) => {
    router.push({
      pathname: catalogId,
      query: {page: currentPage.selected + 1},
    });
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <SC.SearchPage>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  if (session?.user) {
    const {accessToken} = session.user;
    const pageNumb = query.page || 1;
    let catalogId = '';
    let searchConceptResponse: SearchConceptResponse;

    const jsonSearchBody = JSON.stringify({
      query: '',
      pagination: {page: Number(pageNumb) - 1, size: 5},
    });

    try {
      catalogId = query.catalogId[0];
    } catch (error) {
      console.log(error);
    }

    if (catalogId) {
      searchConceptResponse = await searchConceptsForCatalog(
        catalogId,
        accessToken,
        jsonSearchBody
      );
    }

    if (!searchConceptResponse) {
      searchConceptResponse = {} as SearchConceptResponse;
    }

    return {
      props: {
        catalogId,
        searchConceptResponse,
        pageNumb,
        accessToken,
      },
    };
  }

  return {
    props: {},
  };
};

export default SearchPage;
