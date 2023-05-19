import { Breadcrumbs, SearchHit, Pagination, BreadcrumbType } from '@catalog-frontend/ui';
import { hasOrganizationReadPermission, localization } from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import { SearchField } from '@catalog-frontend/ui';
import { PageBanner } from '@catalog-frontend/ui';
import { ConceptHitPage, SearchableField } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { Select } from '@catalog-frontend/ui';
import {
  getFields,
  updatePage,
  getDefaultSortOptions,
  SortOptions,
  SortFields,
  SortDirection,
  getSelectOptions,
} from '../../logic/[...catalogId]';
import styles from './style.module.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import { getToken } from 'next-auth/jwt';

export const SearchPage = ({ hasPermission }) => {
  const [page, setPage] = useState<ConceptHitPage>();
  const [concepts, setConcepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const catalogId = router.query.catalogId.toString() ?? '';
  const pageSubtitle = catalogId ?? 'No title';
  const [pageNumb, setPageNum] = useState(1);
  const [selectedFieldOption, setSelectedField] = useState('alleFelter' as SearchableField | 'alleFelter');
  const [selectedSortOption, setSelectedSortOption] = useState(getDefaultSortOptions());
  const fieldOptions = getSelectOptions(localization.search.fields);
  const sortOptions = getSelectOptions(localization.search.sortOptions);
  const dateSortOptions = getSelectOptions(localization.search.dateSortOptions);

  // initial page data population
  useEffect(() => {
    const init = () =>
      updatePage({
        catalogId,
        searchTerm,
        page: pageNumb,
        fields: getFields('alleFelter'),
        sort: selectedSortOption,
      }).then((data) => {
        if (data) {
          setConcepts(data.hits);
          setPage(data.page);
        }
      });
    hasPermission && init();
  }, []);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as BreadcrumbType[])
    : [];

  const changePage = async (currentPage) => {
    router.push({
      pathname: catalogId,
      query: { page: currentPage.selected + 1 },
    });

    const data = await updatePage({
      catalogId,
      searchTerm,
      page: currentPage,
      fields: getFields(selectedFieldOption),
      sort: selectedSortOption,
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
      fields: getFields(selectedFieldOption),
      sort: selectedSortOption,
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

  const onAlphabeticSortSelect = async (selectValue: SortDirection) => {
    setSelectedSortOption({
      ...selectedSortOption,
      direction: selectValue,
    } as unknown as SortOptions);
  };

  const onDateSortSelect = async (selectValue: SortFields) => {
    setSelectedSortOption({
      ...selectedSortOption,
      field: selectValue,
    } as unknown as SortOptions);
  };

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className={styles.pageContainer}>
        {hasPermission ? (
          <>
            <div className={styles.searchRowContainer}>
              <SearchField
                ariaLabel={localization.search.searchInAllFields}
                placeholder={localization.search.searchInAllFields}
                onSearchSubmit={onSearchSubmit}
              />
              <Select
                label={localization.search.searchField}
                options={fieldOptions}
                onChange={onFieldSelect}
                value={selectedFieldOption}
              />
              <Select
                label={localization.search.dateSort}
                options={dateSortOptions}
                onChange={onDateSortSelect}
                value={selectedSortOption.field}
              />
              <Select
                label={localization.search.alphabeticalSort}
                options={sortOptions}
                onChange={onAlphabeticSortSelect}
                value={selectedSortOption.direction}
              />
            </div>
            <div>
              {concepts &&
                concepts.map((concept) => (
                  <div
                    className={styles.searchHitContainer}
                    key={concept.id}
                  >
                    <SearchHit
                      searchHit={concept}
                      catalogId={catalogId}
                    />
                  </div>
                ))}
              <Pagination
                onPageChange={changePage}
                forcePage={pageNumb - 1}
                pageCount={page ? page.totalPages - 1 : 0}
              />
            </div>
          </>
        ) : (
          <div>{localization.noAccess}</div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  return {
    props: {
      hasPermission: token && hasOrganizationReadPermission(token.access_token, catalogId),
    },
  };
}

export default SearchPage;
