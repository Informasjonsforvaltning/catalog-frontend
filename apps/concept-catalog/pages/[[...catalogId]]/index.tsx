import {getServerSession} from 'next-auth/next';
import {useEffect} from 'react';

import {
  Breadcrumbs,
  breadcrumbT,
  PageTitle,
  PageSubtitle,
  Button,
  Icon,
  SearchHit,
} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/search-page';
import styles from 'libs/ui/src/lib/pagination/pagination.module.css';
import {ArrowLeftIcon, ArrowRightIcon} from '@navikt/aksel-icons';
import {GetServerSideProps} from 'next';
import {authOptions} from '../api/auth/[...nextauth]';
import {
  action,
  searchConceptsForCatalog,
  useConceptDispatch,
  useConceptState,
} from '@catalog-frontend/data-access';
import {Concept, ConceptHitPageProps} from '@catalog-frontend/types';
import ReactPaginate from 'react-paginate';
import {useRouter} from 'next/router';

interface SearchConceptResponseProps {
  hits: Concept[];
  page: ConceptHitPageProps;
}
interface SearchPageProps {
  catalogId: string;
  searchConceptResponse: SearchConceptResponseProps;
  pageNumb: number;
}

export const SearchPage = ({
  catalogId,
  searchConceptResponse,
  pageNumb,
}: SearchPageProps) => {
  const router = useRouter();
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  const pageSubtitle = catalogId ?? 'No title';
  let conceptState = undefined;
  const dispatch = useConceptDispatch();

  if (Object.entries(searchConceptResponse).length !== 0) {
    conceptState = {
      catalogId: catalogId,
      concepts: searchConceptResponse.hits,
      page: searchConceptResponse.page,
    };
  }

  useEffect(() => {
    dispatch(action('POPULATE', conceptState));
  }, []);

  const changePage = (currentPage) => {
    router.push({
      pathname: catalogId,
      query: {page: currentPage.selected + 1},
    });
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <SC.SearchPage>
        <SC.ContainerOne>
          <div>
            <PageTitle>{localization.catalogType.concept}</PageTitle>
            <PageSubtitle>{pageSubtitle}</PageSubtitle>
          </div>
          <Button
            name={localization.button.addConcept}
            bg="#2d3741"
            btnType="filled"
            iconPos="left"
            startIcon={<Icon name="circlePlusStroke" />}
          />
          <Button
            name={localization.button.importConcept}
            bg="#2e6773"
            btnType="filled"
          />
        </SC.ContainerOne>
        <SC.ContainerOne>
          <div>
            {searchConceptResponse.hits && searchConceptResponse.hits.map((hit) => (
              <SC.SearchHitContainer key={hit.id}>
                <SearchHit searchHit={hit} />
              </SC.SearchHitContainer>
            ))}
            <ReactPaginate
              onPageChange={changePage}
              forcePage={pageNumb - 1}
              pageCount={
                searchConceptResponse.page
                  ? searchConceptResponse.page.totalPages
                  : 0
              }
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              previousLabel={<ArrowLeftIcon />}
              nextLabel={<ArrowRightIcon />}
              breakLabel='...'
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

  if (session?.user) {
    const {accessToken} = session.user;
    let pageNumb = query.page || 1;

    const pageQuery = JSON.stringify({
      query: '',
      pagination: {page: Number(pageNumb) - 1, size: 5},
    });

    let catalogId = '';
    let searchConceptResponse: SearchConceptResponseProps;

    try {
      catalogId = query.catalogId[0];
    } catch (error) {
      console.log(error);
    }

    if (catalogId) {
      searchConceptResponse = await searchConceptsForCatalog(
        catalogId,
        accessToken,
        pageQuery
      );
    }

    if (!searchConceptResponse) {
      searchConceptResponse = {} as SearchConceptResponseProps;
    }

    return {
      props: {
        catalogId,
        searchConceptResponse,
        pageNumb,
      },
    };
  }
  return {props: {}};
};

export default SearchPage;
