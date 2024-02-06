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
  SearchHitsPageLayout,
  Select,
} from '@catalog-frontend/ui';
import { getTranslateText, capitalizeFirstLetter, localization as loc } from '@catalog-frontend/utils';
import { Chip } from '@digdir/design-system-react';
import { PlusCircleIcon, FileImportIcon } from '@navikt/aksel-icons';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString, useQueryState } from 'nuqs';

import { SortOption, getSelectOptions, useSearchConcepts, getFields as getSearchFields } from '../../hooks/search';
import SearchFilter from '../../components/search-filter';
import { useCatalogDesign } from '../../context/catalog-design';
import { useImportConcepts } from '../../hooks/import';
import styles from './search-page.module.css';
import ConceptSearchHits from '../../components/concept-search-hits';
import _ from 'lodash';

export type FilterType = 'published' | 'status' | 'assignedUser' | 'subject' | 'internalFields' | 'label';

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
  const [selectedFieldOption, setSelectedFieldOption] = useState('alleFelter' as SearchableField | 'alleFelter');
  const [selectedSortOption, setSelectedSortOption] = useState(SortOption.RELEVANCE);
  const [page, setPage] = useQueryState('page', parseAsInteger);
  const [searchTerm, setSearchTerm] = useQueryState('search');
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );
  const [filterAssignedUser, setFilterAssignedUser] = useQueryState('filter.assignedUser');
  const [filterInternalFields, setFilterInternalFields] = useQueryState(
    'filter.internalFields',
    parseAsJson<Record<string, string[]>>(),
  );
  const [filterLabel, setFilterLabel] = useQueryState('filter.label', parseAsArrayOf(parseAsString));
  const [filterSubject, setFilterSubject] = useQueryState('filter.subject', parseAsArrayOf(parseAsString));

  const sortMappings: Record<SortOption, QuerySort | undefined> = {
    [SortOption.RELEVANCE]: undefined,
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
        children.push(...getSubjectChildren(childId));
      });

    return children;
  };

  const getSubjectFilterWithChildren = (subjects) => {
    // Fetch lowest level code and add its children to the filter
    // Subjects will always be a path like: Code 1 -> Code 1.1 -> Code 1.1.1
    // The lowest level code will always be the last code in the path, Code 1.1.1 in this example.
    if (subjects.length > 0) {
      const lowestLevelCodeId = subjects[subjects.length - 1];
      const codes = [lowestLevelCodeId, ...getSubjectChildren(+lowestLevelCodeId)];
      return codes;
    }
    return [];
  };

  const { status, data, refetch } = useSearchConcepts({
    catalogId,
    searchTerm: searchTerm ?? '',
    page: page ?? 0,
    fields: getSearchFields(selectedFieldOption),
    sort: sortMappings[selectedSortOption],
    filters: {
      ...(filterStatus?.length && {
        status: { value: filterStatus },
      }),
      ...(filterPublicationState?.length === 1 && {
        published: { value: filterPublicationState.includes('published') },
      }),
      ...(filterAssignedUser?.length && {
        assignedUser: { value: [filterAssignedUser] },
      }),
      ...(filterSubject?.length && {
        subject: { value: getSubjectFilterWithChildren(filterSubject) },
      }),
      ...(filterLabel?.length && {
        label: { value: filterLabel },
      }),
      ...(Object.keys(filterInternalFields ?? {}).length > 0 && {
        internalFields: {
          value: Object.keys(filterInternalFields ?? {}).reduce((result, key) => {
            const value = filterInternalFields?.[key];
            if (!_.isEmpty(value)) {
              result[key] = value;
            }
            return result;
          }, {}),
        },
      }),
    },
  });

  const importConcepts = useImportConcepts(catalogId);
  const pageSubtitle = organization?.name ?? catalogId;
  const fieldOptions = getSelectOptions(loc.search.fields).map((opt) => (
    <option
      key={`fieldOption-${opt.value}`}
      value={opt.value}
    >
      {opt.label}
    </option>
  ));
  const sortOptions = getSelectOptions(loc.search.sortOptions).map((opt) => (
    <option
      key={`sortOption-${opt.value}`}
      value={opt.value}
    >
      {opt.label}
    </option>
  ));

  const getUsername = (userId: string) => {
    const user = usersResult?.users?.find((u) => u.id === userId);
    return user?.name ?? '';
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: loc.catalogType.concept,
        },
      ] as BreadcrumbType[])
    : [];

  const onPageChange = (page: number) => {
    setPage(page - 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const removeFilter = (filterName, filterType: FilterType) => {
    switch (filterType) {
      case 'published':
        setFilterPublicationState(filterPublicationState?.filter((name) => name !== filterName) ?? []);
        break;
      case 'status':
        setFilterStatus(filterStatus?.filter((name) => name !== filterName) ?? []);
        break;
      case 'assignedUser':
        setFilterAssignedUser('');
        break;
      case 'subject':
        setFilterSubject(filterSubject?.filter((name) => name !== filterName) ?? []);
        break;
      case 'internalFields': {
        const newFilter = filterInternalFields ?? {};
        if (newFilter[filterName.key] !== undefined) {
          newFilter[filterName.key] = newFilter[filterName.key].filter((value) => value !== filterName.value);
        }
        setFilterInternalFields({ ...newFilter });
        break;
      }
      case 'label':
        setFilterLabel(filterLabel?.filter((name) => name !== filterName) ?? []);
        break;
      default:
        break;
    }
    setPage(0);
  };

  const onSearchSubmit = (search) => {
    setSearchTerm(search);
    setPage(0);
  };

  const onFieldSelect = (field: SearchableField) => {
    setSelectedFieldOption(field);
    setPage(0);
  };

  const onSortSelect = async (optionValue: SortOption) => {
    setSelectedSortOption(optionValue);
  };

  const onImportUpload = (event) => {
    importConcepts.mutate(event.target.files[0], { onError: (error) => alert('Import failed: ' + error) });
  };

  const onLabelClick = (label: string) => {
    let currentLabels = filterLabel ?? [];
    if (!currentLabels.includes(label)) {
      currentLabels = [...currentLabels, label];
    }
    setFilterLabel(currentLabels);
    setPage(0);
  };

  const design = useCatalogDesign();

  useEffect(() => {
    refetch().catch((error) => console.error('refetch() failed: ', error));
  }, [selectedSortOption, refetch]);

  let logo: string | undefined;
  if (design?.hasLogo) {
    logo = `/api/catalog-admin/${catalogId}/design/logo`;
  }

  const FilterChips = () => (
    <div className={styles.chips}>
      <Chip.Group
        size='small'
        className={styles.wrap}
      >
        {filterSubject?.map((filter, index) => (
          <Chip.Removable
            key={`subject-${index}`}
            onClick={() => removeFilter(filter, 'subject')}
          >
            {getTranslateText(subjectCodeList.codes.find((c) => c.id === filter)?.name)}
          </Chip.Removable>
        ))}
        {filterLabel?.map((filter, index) => (
          <Chip.Removable
            key={`label-${index}`}
            onClick={() => removeFilter(filter, 'label')}
          >
            {filter}
          </Chip.Removable>
        ))}
        {filterStatus?.map((filter, index) => (
          <Chip.Removable
            key={`status-${index}`}
            onClick={() => removeFilter(filter, 'status')}
          >
            {capitalizeFirstLetter(getTranslateText(conceptStatuses?.find((s) => s.uri === filter)?.label) as string)}
          </Chip.Removable>
        ))}
        {filterAssignedUser && (
          <Chip.Removable
            key={`${filterAssignedUser}`}
            onClick={() => removeFilter(getUsername(filterAssignedUser), 'assignedUser')}
          >
            {getUsername(filterAssignedUser)}
          </Chip.Removable>
        )}
        {filterPublicationState?.map((filter, index) => (
          <Chip.Removable
            key={`published-${index}`}
            onClick={() => removeFilter(filter, 'published')}
          >
            {filter === 'published' ? loc.publicationState.published : loc.publicationState.unpublished}
          </Chip.Removable>
        ))}
        {filterInternalFields &&
          Object.entries(filterInternalFields).map(([key, values]: [string, string[]], index) => {
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
  );

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
      <SearchHitsPageLayout
        buttonRow={
          <>
            <Button
              as={Link}
              href={`/${catalogId}/change-requests`}
              variant='secondary'
            >
              {loc.changeRequest.changeRequest}
            </Button>
            {hasWritePermission && (
              <Button
                as={Link}
                href={`/${catalogId}/new`}
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
          </>
        }
        searchRow={
          <>
            <div>
              <SearchField
                ariaLabel={loc.search.search}
                placeholder={loc.search.search}
                onSearchSubmit={onSearchSubmit}
                value={searchTerm ?? ''}
              />
              <FilterChips />
            </div>

            <div className={styles.searchOptions}>
              <Select
                label={loc.search.searchField}
                onChange={(event) => onFieldSelect(event.target.value as SearchableField)}
              >
                {fieldOptions}
              </Select>
              <Select
                label={loc.search.sort}
                onChange={(event) => onSortSelect(event?.target.value as SortOption)}
                value={selectedSortOption}
              >
                {sortOptions}
              </Select>
            </div>
          </>
        }
        leftColumn={
          <SearchFilter
            catalogId={catalogId}
            internalFields={fieldsResult?.internal}
            subjectCodeList={subjectCodeList}
            conceptStatuses={conceptStatuses}
          />
        }
        mainColumn={
          status === 'loading' || importConcepts.status === 'loading' ? (
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
          )
        }
      />
    </>
  );
};
