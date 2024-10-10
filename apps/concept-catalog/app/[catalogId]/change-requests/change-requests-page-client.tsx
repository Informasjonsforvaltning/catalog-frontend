'use client';

import {
  BreadcrumbType,
  Breadcrumbs,
  ChangeRequestStatusTagProps,
  LinkButton,
  PageBanner,
  Tag,
} from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization,
  sortAscending,
  sortDescending,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import cn from 'classnames';
import Link from 'next/link';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import ChangeRequestFilter from '../../../components/change-request-filter';
import ChangeRequestSort from '../../../components/change-request-sort';
import { useCatalogDesign } from '../../../context/catalog-design';
import styles from './change-requests-page.module.css';

export const ChangeRequestsPageClient = ({ catalogId, organization, data, catalogPortalUrl }) => {
  const pageSubtitle = organization?.name ?? '';
  const design = useCatalogDesign();

  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: localization.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: localization.changeRequest.changeRequest,
    },
  ] as BreadcrumbType[];

  const itemTypeOptions = [
    {
      label: localization.changeRequest.changeRequest,
      value: 'changeRequest',
    },
    {
      label: localization.suggestionForNewConcept,
      value: 'suggestionForNewConcept',
    },
  ];

  const statusOptions = [
    {
      label: localization.changeRequest.status.open,
      value: 'open',
    },
    {
      label: localization.changeRequest.status.accepted,
      value: 'accepted',
    },
    {
      label: localization.changeRequest.status.rejected,
      value: 'rejected',
    },
  ];

  const sortOptions = Object.entries(localization.changeRequest.sortOptions ?? {}).map(([key, value]) => ({
    label: value as string,
    value: key,
  }));

  const [filterItemType, setFilterItemType] = useQueryState(
    'filter.itemType',
    parseAsString.withDefault(itemTypeOptions[0].value),
  );

  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString).withDefault([]));

  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('TIME_FOR_PROPOSAL_DESC'));

  const onItemTypeChange = (value: string) => {
    setFilterItemType(value);
  };

  const onStatusChange = (values: string[]) => {
    setFilterStatus(values);
  };

  const onSortChange = (e) => {
    setSort(e.target.value);
  };

  const itemType = {
    options: itemTypeOptions,
    selected: filterItemType,
    onChange: onItemTypeChange,
  };

  const status = {
    options: statusOptions,
    selected: filterStatus,
    onChange: onStatusChange,
  };

  let listItems;
  if (filterItemType === 'changeRequest') {
    listItems = data.filter((item) => item.conceptId !== null);
  } else if (filterItemType === 'suggestionForNewConcept') {
    listItems = data.filter((item) => item.conceptId === null);
  } else {
    listItems = data;
  }

  if (filterStatus && filterStatus.length > 0) {
    listItems = listItems.filter((item) => filterStatus.includes(item.status.toLowerCase()));
  }

  switch (sort) {
    case 'TIME_FOR_PROPOSAL_ASC':
      listItems = listItems.sort((a, b) => sortAscending(a.timeForProposal, b.timeForProposal));
      break;
    case 'TIME_FOR_PROPOSAL_DESC':
      listItems = listItems.sort((a, b) => sortDescending(a.timeForProposal, b.timeForProposal));
      break;
    case 'TITLE_ASC':
      listItems = listItems.sort((a, b) => sortAscending(a.title.toLowerCase(), b.title.toLowerCase()));
      break;
    case 'TITLE_DESC':
      listItems = listItems.sort((a, b) => sortDescending(a.title.toLowerCase(), b.title.toLowerCase()));
      break;
    default:
      break;
  }

  const getTranslatedStatus = (status: string) =>
    Object.entries(localization.changeRequest.status as Record<string, string>)
      .find(([key]) => key === status.toLowerCase())?.[1]
      .toString();

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} catalogPortalUrl={catalogPortalUrl} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
      />
      <div className='container'>
        <div className={styles.newConceptSuggestionButton}>
          <LinkButton href={`/${catalogId}/change-requests/new`}>{localization.suggestionForNewConcept}</LinkButton>
        </div>
        <div className={styles.filterAndListContainer}>
          <div className={styles.alertContainer}>
            <Alert severity='info'>
              <Heading
                level={2}
                size='xsmall'
                spacing
              >
                {localization.changeRequest.alert.changeRequestDescription.heading}
              </Heading>
              <Paragraph>{localization.changeRequest.alert.changeRequestDescription.paragraph}</Paragraph>
            </Alert>
          </div>
          <span className={styles.headingAndSortContainer}>
            <Heading
              level={2}
              size='medium'
              className={styles.listHeading}
            >
              {filterItemType === 'changeRequest'
                ? localization.changeRequest.changeRequest
                : localization.suggestionForNewConcept}
            </Heading>
            <ChangeRequestSort
              options={sortOptions}
              selected={sort}
              onChange={onSortChange}
            />
          </span>
          <ChangeRequestFilter
            itemType={itemType}
            status={status}
          />
          {listItems && listItems.length !== 0 ? (
            <div className={styles.listWrapper}>
              <ul className={styles.list}>
                {listItems.map(({ id, title, catalogId, timeForProposal, proposedBy, status }) => (
                  <li
                    key={id}
                    itemID={id}
                    title={catalogId}
                    className={styles.listItem}
                  >
                    <div className={styles.listContent}>
                      <div>
                        <Heading
                          level={3}
                          size={'xsmall'}
                        >
                          <Link
                            prefetch={false}
                            href={
                              validOrganizationNumber(catalogId) &&
                              validUUID(id) &&
                              listItems.find(({ id: changeRequestId }) => changeRequestId === id)
                                ? `/${catalogId}/change-requests/${id}`
                                : '#'
                            }
                            className={title ? styles.heading : cn(styles.heading, styles.noName)}
                          >
                            {title || `(${localization.changeRequest.noName})`}
                          </Link>
                        </Heading>
                        <div className={styles.text}>
                          <p>
                            {localization.concept.created}: {convertTimestampToDateAndTime(timeForProposal)}
                          </p>
                          <p>
                            {localization.concept.createdBy}:{' '}
                            {proposedBy.name
                              .split(' ')
                              .map((namePart) => capitalizeFirstLetter(namePart))
                              .join(' ')}
                          </p>
                        </div>
                      </div>
                      {status && (
                        <div className={styles.status}>
                          <Tag.ChangeRequestStatus
                            statusKey={status}
                            statusLabel={getTranslatedStatus(status) as ChangeRequestStatusTagProps['statusLabel']}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.noHits}>
              <p>{localization.changeRequest.noHits}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangeRequestsPageClient;
