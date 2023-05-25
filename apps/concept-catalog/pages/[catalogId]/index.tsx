import { Breadcrumbs, SearchHit, Pagination, Select, Spinner, BreadcrumbType } from '@catalog-frontend/ui';
import { hasOrganizationReadPermission, localization, textToNumber } from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import { SearchField } from '@catalog-frontend/ui';
import { PageBanner } from '@catalog-frontend/ui';
import { Concept, SearchableField } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { SortDirection } from '@digdir/design-system-react';
import {
  SortFields,
  SortOptions,
  getDefaultSortOptions,
  getFields,
  getSelectOptions,
  useSearchConcepts,
} from '../../hooks/search';
import cn from './search-page.module.css';
import { getToken } from 'next-auth/jwt';
import { Button } from '@catalog-frontend/ui';
import { FileImportIcon, PlusCircleIcon } from '@navikt/aksel-icons';

export const SearchPage = ({ hasPermission }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const pageNumber: number = textToNumber(router.query.page as string, 1);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFieldOption, setSelectedFieldOption] = useState('alleFelter' as SearchableField | 'alleFelter');
  const [selectedSortOption, setSelectedSortOption] = useState(getDefaultSortOptions());
  const [currentPage, setCurrentPage] = useState(pageNumber);

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm,
    page: currentPage,
    fields: getFields(selectedFieldOption),
    sort: selectedSortOption,
  });

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

  const changePage = async (page: { selected: number }) => {
    router.push({
      pathname: catalogId,
      query: { page: page.selected + 1 },
    });

    setCurrentPage(page.selected + 1);
  };

  const onSearchSubmit = (term = searchTerm) => {
    setSearchTerm(term);
  };

  const onFieldSelect = (selectValue: SearchableField) => {
    setSelectedFieldOption(selectValue);
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
  }, [searchTerm, currentPage, selectedFieldOption, selectedSortOption, refetch]);

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={cn.pageContainer}>
          {hasPermission ? (
            <>
              <div className={cn.searchRowContainer}>
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
              <div className={cn.buttonsContainer}>
                <Button
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
                  <div className={cn.error}>
                    <span>{localization.somethingWentWrong}</span>
                  </div>
                ) : (
                  <>
                    {data?.hits.map((concept: Concept) => (
                      <div
                        className={cn.searchHitContainer}
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
