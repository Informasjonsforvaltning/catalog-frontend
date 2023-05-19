import {
  Breadcrumbs,
  BreadcrumbType,
  SearchHit,
  Pagination,
} from '@catalog-frontend/ui';
import {
  hasOrganizationReadPermission,
  localization,
} from '@catalog-frontend/utils';
import {useRouter} from 'next/router';
import {SearchField} from '@catalog-frontend/ui';
import {PageBanner} from '@catalog-frontend/ui';
import {SearchableField} from '@catalog-frontend/types';
import {useEffect, useState} from 'react';
import {Select} from '@digdir/design-system-react';
import {
  getFields,
  getSelectOptions,
  useSearchConcepts,
} from '../../hooks/search';
import styles from './style.module.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import { getToken } from 'next-auth/jwt';

export const SearchPage = ({ hasPermission }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const pageNumber: number = +router.query.page ?? 1;

  const [searchTerm, setSearchTerm] = useState('');  
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(pageNumber as number);
  const [selectedFieldOption, setSelectedFieldOption] = useState(
    'alleFelter' as SearchableField | 'alleFelter'
  );
  const [selectedSortOption, setSelectedSortOption] = useState(getDefaultSortOptions());
=======
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [selectedField, setSelectedField] = useState<SearchableField|'alleFelter'>('alleFelter');
>>>>>>> 1db0480 (chore: use selected field)

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm,
    page: currentPage,
    fields: getFields(selectedField)});

  const pageSubtitle = catalogId ?? 'No title'; 
  const fieldOptions = getSelectOptions(localization.search.fields);
  const sortOptions = getSelectOptions(localization.search.sortOptions);
  const dateSortOptions = getSelectOptions(localization.search.dateSortOptions);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as BreadcrumbType[])
    : [];

  const changePage = async (page) => {
    router.push({
      pathname: catalogId,
      query: {page: page.selected + 1},
    });

    setCurrentPage(page.selected + 1);
  };

  const onSearchSubmit = (term = searchTerm) => {
    setSearchTerm(term);
  };

  const onFieldSelect = (selectValue: SearchableField) => {
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

  useEffect(() => {
    refetch();
<<<<<<< HEAD
  }, [searchTerm, currentPage, selectedFieldOption, selectedSortOption, refetch]);
=======
  }, [searchTerm, currentPage, selectedField, refetch]);
>>>>>>> 1db0480 (chore: use selected field)

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
              {status === "loading" ? (
                <div className={styles.spinner}>
                  <Spinner title={localization.loading} size="3xLarge" />
                </div>
              ) : status === "error" ? (
                <div className={styles.error}>
                  <span>{localization.somethingWentWrong}</span>
                </div>
              ) : (
                <>
                {data?.hits.map((concept) => (
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
                </>
              )}
              {data?.hits.length > 0 && (
                <Pagination
                  onPageChange={changePage}
                  forcePage={currentPage - 1}
                  pageCount={data?.page?.totalPages ?? 0}
                />
              )}
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
