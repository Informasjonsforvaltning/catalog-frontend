'use client';

import { SearchableField, QuerySort } from '@catalog-frontend/types';
import {
  BreadcrumbType,
  Breadcrumbs,
  Button,
  PageBanner,
  UploadButton,
  SearchField,
  SearchHitContainer,
  Spinner,
} from '@catalog-frontend/ui';
import {
  textToNumber,
  validOrganizationNumber,
  getTranslateText,
  capitalizeFirstLetter,
  localization as loc,
} from '@catalog-frontend/utils';
import { Chip, Select } from '@digdir/design-system-react';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';

import { useState, useEffect } from 'react';
import { action, useSearchDispatch, useSearchState } from '../../context/search';
import { SortOption, getSelectOptions, useSearchConcepts, getFields as getSearchFields } from '../../hooks/search';
import SearchFilter from '../../components/search-filter';
import { useCatalogDesign } from '../../context/catalog-design';
import { FilterType } from '../../context/search/state';
import { useImportConcepts } from '../../hooks/import';

import styles from './search-page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import ConceptSearchHits from '../../components/concept-search-hits';

interface Props {
  catalogId: string;
  organization: any;
  hasWritePermission: boolean;
  hasAdminPermission: boolean;
  fieldsResult: any;
  codeListsResult: any;
  usersResult: any;
  conceptStatuses: any;
  FDK_REGISTRATION_BASE_URI: string;
}

export const SearchPageClient = ({
  catalogId,
  organization,
  hasWritePermission,
  hasAdminPermission,
  fieldsResult,
  codeListsResult,
  usersResult,
  conceptStatuses,
  FDK_REGISTRATION_BASE_URI,
}: Props) => {
  const searchParams = useSearchParams();
  const pageNumber: number = textToNumber(searchParams.get('page') as string);

  const router = useRouter();
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
    const children: number[] = [];
    subjectCodeList?.codes
      ?.filter((code) => code.parentID === subjectId)
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

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm,
    page: currentPage,
    fields: getSearchFields(selectedFieldOption),
    sort: sortMappings[selectedSortOption],
    filters: {
      ...(searchState.filters.status?.length &&
        searchState.filters.status.length > 0 && {
          status: { value: searchState.filters.status },
        }),
      ...(searchState.filters.published?.length === 1 && {
        published: { value: searchState.filters.published.includes('published') },
      }),
      ...(searchState.filters.assignedUser && {
        assignedUser: { value: [searchState.filters.assignedUser.id] },
      }),
      ...(searchState.filters.subject?.length &&
        searchState.filters.subject.length > 0 && {
          subject: { value: getSubjectFilterWithChildren(searchState.filters.subject) },
        }),
      ...(searchState.filters.label?.length &&
        searchState.filters.label.length > 0 && {
          label: { value: searchState.filters.label },
        }),
      ...(Object.keys(searchState.filters.internalFields ?? {}).length > 0 && {
        internalFields: { value: searchState.filters.internalFields },
      }),
    },
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

  const onPageChange = (page: number) => {
    router.push(`${catalogId}?page=${page - 1}`);
    setCurrentPage(page - 1);
  };

  const removeFilter = (filterName, filterType: FilterType) => {
    let updatedFilters;

    if (filterType !== 'assignedUser' && filterType !== 'internalFields') {
      updatedFilters = searchState.filters[filterType]?.filter((name) => name !== filterName);
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
        searchDispatch(action('SET_ASSIGNED_USER_FILTER', { filters: { assignedUser: undefined } }));
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
    importConcepts.mutate(event.target.files[0], { onError: (error) => alert('Import failed: ' + error) });
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
    if (currentPage !== pageNumber) {
      setCurrentPage(pageNumber);
    }
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [currentPage, selectedSortOption, refetch, pageNumber]);

  let logo: string | undefined;
  if (design?.hasLogo) {
    logo = `/api/catalog-admin/${catalogId}/design/logo`;
  }
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
        logo={logo}
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
                  variant='secondary'
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
                catalogId={catalogId}
                internalFields={fieldsResult?.internal}
                subjectCodeList={subjectCodeList}
                conceptStatuses={conceptStatuses}
              />
              {status === 'loading' || importConcepts.status === 'loading' ? (
                <Spinner />
              ) : (
                <SearchHitContainer
                  onPageChange={onPageChange}
                  noSearchHits={data.hits.length < 1}
                  paginationInfo={data?.page}
                  searchHits={
                    <ConceptSearchHits
                      catalogId={catalogId}
                      data={data}
                      conceptStatuses={conceptStatuses}
                      subjectCodeList={subjectCodeList}
                      assignableUsers={usersResult?.users ?? []}
                      onLabelClick={onLabelClick}
                    />
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
