import {
  Breadcrumbs,
  Pagination,
  Select,
  Spinner,
  BreadcrumbType,
  Button,
  UploadButton,
  PageBanner,
  SearchField,
  Chips,
  SearchHitContainer,
  CustomError,
} from '@catalog-frontend/ui';
import {
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  localization as loc,
  textToNumber,
  validOrganizationNumber,
} from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import { Organization, QuerySort, SearchableField } from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { getFields, getSelectOptions, useSearchConcepts, SortOption } from '../../hooks/search';
import styles from './search-page.module.css';
import { getToken } from 'next-auth/jwt';
import { FileImportIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import SideFilter from '../../components/side-filter';
import { useCreateConcept } from '../../hooks/concepts';
import { getOrganization } from '@catalog-frontend/data-access';
import { useImportConcepts } from '../../hooks/import';
import { useSearchDispatch, useSearchState } from '../../context/search';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export const SearchPage = ({ organization, hasWritePermission, FDK_REGISTRATION_BASE_URI }) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;
  const createConcept = useCreateConcept(catalogId);
  const pageNumber: number = textToNumber(router.query.page as string, 0);

  const searchState = useSearchState();
  const searchDispatch = useSearchDispatch();
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
      searchState.filters.status?.length > 0 && {
        status: { value: searchState.filters.status },
      },
      searchState.filters.published?.length === 1 && {
        published: { value: searchState.filters.published.includes('published') },
      },
    ),
  });

  const importConcepts = useImportConcepts(catalogId);
  const pageSubtitle = organization?.name ?? catalogId;
  const fieldOptions = getSelectOptions(loc.search.fields);
  const sortOptions = getSelectOptions(loc.search.sortOptions);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: loc.catalogType.concept,
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

  const removeFilter = (name: string) => {
    const filters = searchState.filters.published?.filter(function (filterName) {
      return filterName !== name;
    });
    searchDispatch({
      type: 'SET_PUBLICATION_STATE',
      payload: { filters: { published: filters.map((name) => name) } },
    });
  };

  const onSearchSubmit = (term = searchTerm) => {
    setSearchTerm(term);
    setCurrentPage(0);
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

  const onSeeChangeRequests = () => {
    if (validOrganizationNumber(catalogId)) {
      router.push(`${catalogId}/change-requests`);
    }
  };

  useEffect(() => {
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [searchTerm, currentPage, selectedFieldOption, selectedSortOption, searchState, refetch]);

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={styles.pageContainer}>
          <div className={styles.secondRowContainer}>
            <Chips size='small'>
              {searchState.filters.published?.map((filter, index) => (
                <Chips.Removable
                  key={index}
                  onClick={() => removeFilter(filter)}
                >
                  {filter === 'published' ? loc.publicationState.published : loc.publicationState.unpublished}
                </Chips.Removable>
              ))}
            </Chips>
            <div className={styles.buttonsContainer}>
              <Button
                variant='outline'
                onClick={onSeeChangeRequests}
              >
                {loc.seeChangeRequests}
              </Button>
              {hasWritePermission && (
                <>
                  <Button
                    onClick={() => createConcept.mutate()}
                    icon={<PlusCircleIcon fontSize='1.5rem' />}
                  >
                    {loc.button.createConcept}
                  </Button>
                  <UploadButton
                    variant='outline'
                    icon={<FileImportIcon fontSize='1.5rem' />}
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
                    {loc.button.importConcept}
                  </UploadButton>
                </>
              )}
            </div>
          </div>

          <div className={styles.searchRowContainer}>
            <SearchField
              ariaLabel={loc.search.searchInAllFields}
              placeholder={loc.search.searchInAllFields}
              onSearchSubmit={onSearchSubmit}
            />
            <div className={styles.searchOptions}>
              <Select
                label={loc.search.searchField}
                options={fieldOptions}
                onChange={onFieldSelect}
                value={selectedFieldOption}
              />
              <Select
                label={loc.search.sort}
                options={sortOptions}
                onChange={onSortSelect}
                value={selectedSortOption}
              />
            </div>
          </div>

          <div>
            <div className={styles.gridContainer}>
              <SideFilter />
              {status === 'loading' ? (
                <Spinner />
              ) : status === 'error' ? (
                <CustomError />
              ) : (
                <SearchHitContainer
                  data={data}
                  catalogId={catalogId}
                />
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

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req });
  const { catalogId } = params;

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  if (!(session?.user && Date.now() < token?.expires_at * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?catalogId=${catalogId}`,
      },
    };
  }

  const hasReadPermission =
    (token && hasOrganizationReadPermission(token.access_token, catalogId)) ||
    hasSystemAdminPermission(token.access_token);
  if (!hasReadPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const hasWritePermission = token && hasOrganizationWritePermission(token.access_token, catalogId);
  const organization: Organization = await getOrganization(catalogId);
  return {
    props: {
      organization,
      hasWritePermission,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default SearchPage;
