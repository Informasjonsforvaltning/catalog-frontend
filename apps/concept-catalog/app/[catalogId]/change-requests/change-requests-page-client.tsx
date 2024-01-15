'use client';

import { BreadcrumbType, Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './change-requests-page.module.css';
import { Alert, Heading, Paragraph, Tag } from '@digdir/design-system-react';
import { useCatalogDesign } from '../../../context/catalog-design';
import cn from 'classnames';
import ChangeRequestFilter from '../../../components/change-request-filter';
import { parseAsString, parseAsArrayOf, useQueryState } from 'nuqs';
import ChangeRequestSort from '../../../components/change-request-sort';
import Link from 'next/link';

export const ChangeRequestsPageClient = ({ catalogId, organization, data, FDK_REGISTRATION_BASE_URI }) => {
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

  const [sort, setSort] = useQueryState('sort', parseAsArrayOf(parseAsString).withDefault(['TIME_FOR_PROPOSAL_ASC']));

  const onItemTypeChange = (value: string) => {
    setFilterItemType(value);
  };

  const onStatusChange = (values: string[]) => {
    setFilterStatus(values);
  };

  const onSortChange = (e) => {
    setSort([e.target.value]);
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

  switch (sort[0]) {
    case 'TIME_FOR_PROPOSAL_ASC':
      listItems = listItems.sort((a, b) => (a.timeForProposal < b.timeForProposal ? 1 : -1));
      break;
    case 'TIME_FOR_PROPOSAL_DESC':
      listItems = listItems.sort((a, b) => (a.timeForProposal > b.timeForProposal ? 1 : -1));
      break;
    case 'TITLE_ASC':
      listItems = listItems.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
      break;
    case 'TITLE_DESC':
      listItems = listItems.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1));
      break;
    default:
      break;
  }

  const getTranslatedStatus = (status: string) =>
    Object.entries(localization.changeRequest.status as Record<string, string>)
      .find(([key]) => key === status.toLowerCase())?.[1]
      .toString();

  const getStatusColorVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
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
          <Button
            as={Link}
            href={`/${catalogId}/change-requests/new`}
          >
            {localization.suggestionForNewConcept}
          </Button>
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
                          <p>{convertTimestampToDateAndTime(timeForProposal)}</p>
                          <p>
                            {proposedBy.name
                              .split(' ')
                              .map((namePart) => capitalizeFirstLetter(namePart))
                              .join(' ')}
                          </p>
                        </div>
                      </div>
                      {status && (
                        <div className={styles.status}>
                          <Tag
                            color={getStatusColorVariant(status)}
                            size='small'
                          >
                            {getTranslatedStatus(status)}
                          </Tag>
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
