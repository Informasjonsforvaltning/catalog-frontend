import {
  Breadcrumbs,
  SearchHit,
  Pagination,
  Select,
  Spinner,
  BreadcrumbType,
  SearchField,
  Button,
  PageBanner,
} from '@catalog-frontend/ui';
import { hasOrganizationReadPermission, localization, textToNumber } from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import { Concept, SearchableField } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { SortOptions, getFields, getSelectOptions, useSearchConcepts, SortOption } from '../../hooks/search';
import styles from './search-page.module.css';
import { getToken } from 'next-auth/jwt';
import { FileImportIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import SideFilter from '../../components/side-filter';
import { useCreateConcept } from '../../hooks/concept';

export const SearchPage = ({ hasPermission }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createConcept = useCreateConcept(catalogId);
  const pageNumber: number = textToNumber(router.query.page as string, 0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFieldOption, setSelectedFieldOption] = useState('alleFelter' as SearchableField | 'alleFelter');
  const [selectedSortOption, setSelectedSortOption] = useState(SortOption.LAST_UPDATED_FIRST);
  const [currentPage, setCurrentPage] = useState(pageNumber);

  const sortMappings: Record<SortOption, SortOptions> = {
    [SortOption.LAST_UPDATED_FIRST]: { field: 'SIST_ENDRET', direction: 'DESC' },
    [SortOption.LAST_UPDATED_LAST]: { field: 'SIST_ENDRET', direction: 'ASC' },
    [SortOption.RECOMMENDED_TERM_AÅ]: { field: 'ANBEFALT_TERM_NB', direction: 'ASC' },
    [SortOption.RECOMMENDED_TERM_ÅA]: { field: 'ANBEFALT_TERM_NB', direction: 'DESC' },
  };

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm,
    page: currentPage,
    fields: getFields(selectedFieldOption),
    sort: sortMappings[selectedSortOption],
  });

  const pageSubtitle = catalogId ?? 'No title';
  const fieldOptions = getSelectOptions(localization.search.fields);
  const sortOptions = getSelectOptions(localization.search.sortOptions);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as BreadcrumbType[])
    : [];

  const changePage = async (page: { selected: number }) => {
    await router.push({
      pathname: catalogId,
      query: { page: page.selected },
    });

    setCurrentPage(page.selected);
  };

  const onSearchSubmit = (term = searchTerm) => {
    setSearchTerm(term);
  };

  const onFieldSelect = (field: SearchableField) => {
    setSelectedFieldOption(field);
  };

  const onSortSelect = async (option: SortOption) => {
    setSelectedSortOption(option);
  };

  useEffect(() => {
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [searchTerm, currentPage, selectedFieldOption, selectedSortOption, refetch]);

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={styles.pageContainer}>
          {hasPermission ? (
            <>
              <div className={styles.searchRowContainer}>
                <SearchField
                  ariaLabel={localization.search.searchInAllFields}
                  placeholder={localization.search.searchInAllFields}
                  onSearchSubmit={onSearchSubmit}
                />
                <div className={styles.searchOptions}>
                  <Select
                    label={localization.search.searchField}
                    options={fieldOptions}
                    onChange={onFieldSelect}
                    value={selectedFieldOption}
                  />
                  <Select
                    label={localization.search.sort}
                    options={sortOptions}
                    onChange={onSortSelect}
                    value={selectedSortOption}
                  />
                </div>
              </div>
              <div className={styles.buttonsContainer}>
                <Button
                  onClick={() => createConcept.mutate()}
                  icon={
                    <PlusCircleIcon
                      title='a11y-title'
                      fontSize='1.5rem'
                    />
                  }
                >
                  {localization.button.createConcept}
                </Button>
                <Button
                  variant='outline'
                  icon={
                    <FileImportIcon
                      title='a11y-title'
                      fontSize='1.5rem'
                    />
                  }
                >
                  {localization.button.importConcept}
                </Button>
              </div>
              <div>
                {status === 'loading' ? (
                  <Spinner />
                ) : status === 'error' ? (
                  <div className={styles.error}>
                    <span>{localization.somethingWentWrong}</span>
                  </div>
                ) : (
                  <div className={styles.gridContainer}>
                    <SideFilter />
                    <div className={styles.searchHitsContainer}>
                      {data?.hits.map((concept: Concept) => (
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
                    </div>
                  </div>
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
