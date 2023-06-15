import {
  Breadcrumbs,
  SearchHit,
  Pagination,
  Select,
  Spinner,
  BreadcrumbType,
  Button,
  UploadButton,
  PageBanner,
  SearchField,
} from '@catalog-frontend/ui';
import { hasOrganizationReadPermission, localization, textToNumber } from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import { Concept, Organization, QuerySort, SearchableField } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { getFields, getSelectOptions, useSearchConcepts, SortOption } from '../../hooks/search';
import styles from './search-page.module.css';
import { getToken } from 'next-auth/jwt';
import { FileImportIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import SideFilter from '../../components/side-filter';
import { useCreateConcept } from '../../hooks/concepts';
import { getOrganization } from '@catalog-frontend/data-access';
import { useSearchState } from '../../context/search';
import { useImportConcepts } from '../../hooks/import';

export const SearchPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createConcept = useCreateConcept(catalogId);
  const pageNumber: number = textToNumber(router.query.page as string, 0);

  const searchState = useSearchState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFieldOption, setSelectedFieldOption] = useState('alleFelter' as SearchableField | 'alleFelter');
  const [selectedSortOption, setSelectedSortOption] = useState(SortOption.LAST_UPDATED_FIRST);
  const [currentPage, setCurrentPage] = useState(pageNumber);

  const sortMappings: Record<SortOption, QuerySort> = {
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
    filters: Object.assign(
      {},
      searchState.filters.published?.length === 1 && {
        published: { value: searchState.filters.published.includes('published') },
      },
    ),
  });

  const importConcepts = useImportConcepts(catalogId);
  const pageSubtitle = organization?.name ?? catalogId;
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

  const onImportUpload = (event) => {
    event.target.files[0].text().then((text) => {
      importConcepts.mutate(text);
    });
  };

  useEffect(() => {
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [searchTerm, currentPage, selectedFieldOption, selectedSortOption, searchState, refetch]);

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={styles.pageContainer}>
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
            <UploadButton
              variant='outline'
              icon={
                <FileImportIcon
                  title='a11y-title'
                  fontSize='1.5rem'
                />
              }
              allowedMimeTypes={[
                'text/csv',
                'text/x-csv',
                'text/plain',
                'application/csv',
                'application/x-csv',
                'application/vnd.ms-excel',
                'application/json',
              ]}
              onUpload={onImportUpload}
            >
              {localization.button.importConcept}
            </UploadButton>
          </div>
          <div>
            <div className={styles.gridContainer}>
              <SideFilter />
              {status === 'loading' ? (
                <Spinner />
              ) : status === 'error' ? (
                <div className={styles.error}>
                  <span>{localization.somethingWentWrong}</span>
                </div>
              ) : (
                <div className={styles.searchHitsContainer}>
                  {data?.hits.length === 0 && <div className={styles.noHits}>{localization.search.noHits}</div>}
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
              )}
            </div>

            {data?.hits.length > 0 && (
              <Pagination
                onPageChange={changePage}
                forcePage={currentPage}
                pageCount={data?.page?.totalPages ?? 0}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      notFound: true,
    };
  }

  const organization: Organization = await getOrganization(catalogId);
  return {
    props: {
      organization,
    },
  };
}

export default SearchPage;
