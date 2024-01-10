'use client';

import { BreadcrumbType, Breadcrumbs, Button, PageBanner, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization as loc,
  localization,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './change-requests-page.module.css';
import { Heading } from '@digdir/design-system-react';
import { useCatalogDesign } from '../../../context/catalog-design';
import cn from 'classnames';
import ChangeRequestFilter from '../../../components/change-request-filter';
import { parseAsString, parseAsArrayOf, useQueryState } from 'nuqs';
import Link from 'next/link';

export const ChangeRequestsPageClient = ({ catalogId, organization, data, FDK_REGISTRATION_BASE_URI }) => {
  const pageSubtitle = organization?.name ?? '';
  const design = useCatalogDesign();

  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: loc.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: loc.changeRequest.changeRequest,
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
      label: localization.changeRequest.status.accepted,
      value: 'accepted',
    },
    {
      label: localization.changeRequest.status.open,
      value: 'open',
    },
    {
      label: localization.changeRequest.status.rejected,
      value: 'rejected',
    },
  ];

  const [filterItemType, setFilterItemType] = useQueryState(
    'filter.itemType',
    parseAsString.withDefault(itemTypeOptions[0].value),
  );

  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString).withDefault([]));

  const onItemTypeChange = (value: string) => {
    setFilterItemType(value);
  };

  const onStatusChange = (values: string[]) => {
    setFilterStatus(values);
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
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
      />
      <div className='container'>
        <div className={styles.newConceptSuggestionButton}>
          <Button
            as={Link}
            href={`/${catalogId}/change-requests/new`}
          >
            {loc.suggestionForNewConcept}
          </Button>
        </div>
        <div className={styles.filterAndListContainer}>
          <Heading
            className={styles.listHeading}
            level={2}
            size='xsmall'
          >
            {loc.changeRequest.changeRequest}
          </Heading>
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
                            {title || `(${loc.changeRequest.noName})`}
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
                          <Tag>{status}</Tag>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.noHits}>
              <p>{loc.changeRequest.noHits}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangeRequestsPageClient;
