import {
  Breadcrumbs,
  Select,
  Spinner,
  BreadcrumbType,
  Button,
  UploadButton,
  PageBanner,
  SearchField,
  SearchHitContainer,
} from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  getTranslateText,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  localization as loc,
  textToNumber,
  validOrganizationNumber,
} from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import {
  CodeListsResult,
  FieldsResult,
  Organization,
  QuerySort,
  SearchableField,
  UsersResult,
} from '@catalog-frontend/types';
import { useEffect, useState } from 'react';
import { getFields as getSearchFields, getSelectOptions, useSearchConcepts, SortOption } from '../../hooks/search';
import styles from './search-page.module.css';
import { FileImportIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import SearchFilter from '../../components/search-filter';
import {
  getAllCodeLists,
  getConceptStatuses,
  getFields,
  getOrganization,
  getUsers,
} from '@catalog-frontend/data-access';
import { useImportConcepts } from '../../hooks/import';
import { action, useSearchDispatch, useSearchState } from '../../context/search';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useCatalogDesign } from '../../context/catalog-design';
import { InferGetServerSidePropsType } from 'next';
import { Chip } from '@digdir/design-system-react';
import { FilterType } from '../../context/search/state';
import { prepareStatusList } from '@catalog-frontend/utils';
import _ from 'lodash';

export const SearchPage = ({
  organization,
  hasWritePermission,
  hasAdminPermission,
  fieldsResult,
  codeListsResult,
  usersResult,
  conceptStatuses,
  FDK_REGISTRATION_BASE_URI,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;
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

  const subjectCodeList = codeListsResult?.codeLists?.find(
    (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
  );

  const getInternalFields = (fieldId) => fieldsResult?.internal?.find((field) => field.id === fieldId);

  const getSubjectChildren = (subjectId: number) => {
    const children = [];
    subjectCodeList?.codes
      .filter((code) => code.parentID === subjectId)
      .map((code) => code.id)
      .forEach((childId) => {
        children.push(childId);
        children.concat(getSubjectChildren(childId));
      });

    return children;
  };

  const getSubjectFilterWithChildren = (subjects) => {
    // Fetch lowest level code and add its children to the filter
    // Subjects will always be a path like: Code 1 -> Code 1.1 -> Code 1.1.1
    // The lowest level code will always be the last code in the path, Code 1.1.1 in this example.
    if (subjects.length > 0) {
      const lowestLevelCodeId = subjects[subjects.length - 1];
      const codes = [...subjects, ...getSubjectChildren(+lowestLevelCodeId)];
      return codes;
    }
    return [];
  };

  const internalFieldFilter = Object.keys(searchState.filters.internalFields ?? {}).reduce((result, key) => {
    return !_.isEmpty(searchState.filters.internalFields[key])
      ? { ...result, ...{ [key]: searchState.filters.internalFields[key] } }
      : result;
  }, {});

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm,
    page: currentPage,
    fields: getSearchFields(selectedFieldOption),
    sort: sortMappings[selectedSortOption],
    filters: Object.assign(
      {},
      searchState.filters.status?.length > 0 && {
        status: { value: searchState.filters.status },
      },
      searchState.filters.published?.length === 1 && {
        published: { value: searchState.filters.published.includes('published') },
      },
      searchState.filters.assignedUser && {
        assignedUser: { value: [searchState.filters.assignedUser.id] },
      },
      searchState.filters.subject?.length > 0 && {
        subject: { value: getSubjectFilterWithChildren(searchState.filters.subject) },
      },
      searchState.filters.label?.length > 0 && {
        label: { value: searchState.filters.label },
      },
      Object.keys(internalFieldFilter ?? {}).length > 0 && {
        internalFields: {
          value: internalFieldFilter,
        },
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

  const removeFilter = (filterName, filterType: FilterType) => {
    let updatedFilters = null;

    if (filterType !== 'assignedUser' && filterType !== 'internalFields') {
      updatedFilters = searchState.filters[filterType].filter((name) => name !== filterName);
    }

    if (filterType === 'internalFields') {
      updatedFilters = { ...searchState.filters.internalFields };
      if (updatedFilters[filterName.key] !== undefined) {
        updatedFilters[filterName.key] = updatedFilters[filterName.key].filter((value) => value !== filterName.value);
      }
    }

    switch (filterType) {
      case 'published':
        searchDispatch(action('SET_PUBLICATION_STATE_FILTER', { filters: { published: updatedFilters } }));
        break;
      case 'status':
        searchDispatch(action('SET_CONCEPT_STATUS_FILTER', { filters: { status: updatedFilters } }));
        break;
      case 'assignedUser':
        searchDispatch(action('SET_ASSIGNED_USER_FILTER', { filters: { assignedUser: null } }));
        break;
      case 'subject':
        searchDispatch(action('SET_SUBJECTS_FILTER', { filters: { subject: updatedFilters } }));
        break;
      case 'internalFields':
        searchDispatch(action('SET_INTERNAL_FIELDS_FILTER', { filters: { internalFields: updatedFilters } }));
        break;
      case 'label':
        searchDispatch(action('SET_LABEL_FILTER', { filters: { label: updatedFilters } }));
        break;
      default:
        break;
    }
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

  const onCreateConceptClick = () => {
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/new`);
    }
  };

  const onLabelClick = (label: string) => {
    let currentLabels = searchState.filters['label'] ?? [];
    if (!currentLabels.includes(label)) {
      currentLabels = [...currentLabels, label];
    }
    searchDispatch(
      action('SET_LABEL_FILTER', {
        filters: { label: currentLabels },
      }),
    );
  };

  const design = useCatalogDesign();

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedFieldOption, searchState]);

  useEffect(() => {
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [currentPage, selectedSortOption, refetch]);

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo && `/api/catalog-admin/${catalogId}/design/logo`}
        logoDescription={design?.logoDescription}
      />
      <div className='container'>
        <div className={styles.pageContainer}>
          <div className={styles.secondRowContainer}>
            <div className={styles.buttonsContainer}>
              {hasWritePermission && (
                <Button
                  onClick={onCreateConceptClick}
                  icon={<PlusCircleIcon fontSize='1.5rem' />}
                >
                  {loc.button.createConcept}
                </Button>
              )}
              {hasAdminPermission && (
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
              )}
            </div>
          </div>

          <div className={styles.searchRowContainer}>
            <div>
              <SearchField
                ariaLabel={loc.search.search}
                placeholder={loc.search.search}
                onSearchSubmit={onSearchSubmit}
              />
              <div className={styles.chips}>
                <Chip.Group
                  size='small'
                  className={styles.wrap}
                >
                  {searchState.filters.subject &&
                    searchState.filters.subject?.map((filter, index) => (
                      <Chip.Removable
                        key={`subject-${index}`}
                        onClick={() => removeFilter(filter, 'subject')}
                      >
                        {getTranslateText(subjectCodeList.codes.find((c) => c.id === Number(filter))?.name)}
                      </Chip.Removable>
                    ))}
                  {searchState.filters.label &&
                    searchState.filters.label?.map((filter, index) => (
                      <Chip.Removable
                        key={`label-${index}`}
                        onClick={() => removeFilter(filter, 'label')}
                      >
                        {filter}
                      </Chip.Removable>
                    ))}
                  {searchState.filters?.status &&
                    searchState.filters?.status.map((filter, index) => (
                      <Chip.Removable
                        key={`status-${index}`}
                        onClick={() => removeFilter(filter, 'status')}
                      >
                        {capitalizeFirstLetter(
                          getTranslateText(conceptStatuses?.find((s) => s.uri === filter)?.label) as string,
                        )}
                      </Chip.Removable>
                    ))}
                  {searchState.filters.assignedUser && (
                    <Chip.Removable
                      key={`${searchState.filters.assignedUser}`}
                      onClick={() => removeFilter(searchState.filters?.assignedUser?.name, 'assignedUser')}
                    >
                      {searchState.filters?.assignedUser?.name}
                    </Chip.Removable>
                  )}
                  {searchState.filters.published &&
                    searchState.filters.published?.map((filter, index) => (
                      <Chip.Removable
                        key={`published-${index}`}
                        onClick={() => removeFilter(filter, 'published')}
                      >
                        {filter === 'published' ? loc.publicationState.published : loc.publicationState.unpublished}
                      </Chip.Removable>
                    ))}
                  {searchState.filters.internalFields &&
                    Object.entries(searchState.filters.internalFields).map(([key, values], index) => {
                      return values.map((value, innerIndex) => (
                        <Chip.Removable
                          key={`internalFields-${index}-${innerIndex}`}
                          onClick={() => {
                            removeFilter({ key: key, value: value }, 'internalFields');
                          }}
                        >
                          {`${getTranslateText(getInternalFields(key).label)}: ${value === 'true' ? loc.yes : loc.no}`}
                        </Chip.Removable>
                      ));
                    })}
                </Chip.Group>
              </div>
            </div>

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
              <SearchFilter
                internalFields={fieldsResult?.internal}
                subjectCodeList={subjectCodeList}
                conceptStatuses={conceptStatuses}
              />
              {status === 'loading' || importConcepts.status === 'loading' ? (
                <Spinner />
              ) : (
                <SearchHitContainer
                  data={data}
                  catalogId={catalogId}
                  subjectCodeList={subjectCodeList}
                  conceptStatuses={conceptStatuses}
                  assignableUsers={usersResult?.users ?? []}
                  onLabelClick={onLabelClick}
                  onPageChange={changePage}
                  forcePage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);
  const { catalogId } = params;

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}`,
      },
    };
  }

  const hasReadPermission =
    session &&
    (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session.accessToken));
  if (!hasReadPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const hasAdminPermission = session && hasOrganizationAdminPermission(session?.accessToken, catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );
  const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
    (response) => response.json(),
  );

  const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );

  const conceptStatuses = await getConceptStatuses()
    .then((response) => response.json())
    .then((body) => body?.conceptStatuses ?? [])
    .then((statuses) => prepareStatusList(statuses));

  return {
    props: {
      organization,
      hasWritePermission,
      hasAdminPermission,
      fieldsResult,
      codeListsResult,
      usersResult,
      conceptStatuses,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default SearchPage;
