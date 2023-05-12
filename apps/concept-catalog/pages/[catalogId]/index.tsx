import {
  Breadcrumbs,
  breadcrumbT,
  SearchHit,
  Pagination,
} from '@catalog-frontend/ui';
import {
  hasOrganizationReadPermission,
  localization,
} from '@catalog-frontend/utils';
import {ArrowLeftIcon, ArrowRightIcon} from '@navikt/aksel-icons';
import ReactPaginate from 'react-paginate';
import {useRouter} from 'next/router';
import {SearchField} from '@catalog-frontend/ui';
import {PageBanner} from '@catalog-frontend/ui';
import {ConceptHitPage, SearchableField} from '@catalog-frontend/types';
import {useEffect, useState} from 'react';
import {Select} from '@digdir/design-system-react';
import {
  getFields,
  getSelectOptions,
  updatePage,
} from '../../logic/[[...catalogId]]';
import styles from './style.module.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import {getToken} from 'next-auth/jwt';

export const SearchPage = () => {
  const [page, setPage] = useState<ConceptHitPage>();
  const [concepts, setConcepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const catalogId = router.query.catalogId.toString() ?? '';
  const pageSubtitle = catalogId ?? 'No title';
  const [pageNumb, setPageNum] = useState(1);
  const [selectedField, setSelectedField] = useState(
    'alleFelter' as SearchableField | 'alleFelter'
  );
  const selectOptions = getSelectOptions();

  // initial page data population
  useEffect(() => {
    const init = () =>
      updatePage({
        catalogId,
        searchTerm,
        page: pageNumb,
        fields: getFields('alleFelter'),
      }).then((data) => {
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

    const data = await updatePage({
      catalogId,
      searchTerm,
      page: currentPage,
      fields: getFields(selectedField),
    });

    if (data) {
      setConcepts(data.hits);
      setPage(data.page);
      setPageNum(currentPage.selected + 1);
    }
  };

  const onSearchSubmit = async (term = searchTerm) => {
    const data = await updatePage({
      catalogId,
      searchTerm: term,
      page: page.currentPage,
      fields: getFields(selectedField),
    });

    if (data) {
      setConcepts(data.hits);
      setPage(data.page);
      setSearchTerm(term);
    }
  };

  const onFieldSelect = async (selectValue: SearchableField) => {
    setSelectedField(selectValue);
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className={styles.pageContainer}>
        <div className={styles.searchRowContainer}>
          <SearchField
            ariaLabel={localization.search.searchInAllFields}
            placeholder={localization.search.searchInAllFields}
            onSearchSubmit={onSearchSubmit}
          />
          <span className={styles.select}>
            <Select
              options={selectOptions}
              onChange={onFieldSelect}
              value={selectedField}
              deleteButtonLabel='x'
            />
          </span>
        </div>
        <div>
          {concepts &&
            concepts.map((concept) => (
              <div className={styles.searchHitContainer} key={concept.id}>
                <SearchHit searchHit={concept} catalogId={catalogId} />
              </div>
            ))}
          <Pagination
            onPageChange={changePage}
            forcePage={pageNumb - 1}
            pageCount={page ? page.totalPages - 1 : 0}
          />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
	const token = await getToken({ req });
  const { catalogId } = params;

  if(!token || !hasOrganizationReadPermission(token.access_token, catalogId)) {
    return {    
      notFound: true 
    };
  }

  return {
    props: {},
  };
}

export default SearchPage;
