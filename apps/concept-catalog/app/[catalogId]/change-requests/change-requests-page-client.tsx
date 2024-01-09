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
import { useRouter } from 'next/navigation';
import { Heading, Link } from '@digdir/design-system-react';
import { useCatalogDesign } from '../../../context/catalog-design';
import cn from 'classnames';
import ChangeRequestFilter from '../../../components/change-request-filter';
import { parseAsString, useQueryState } from 'nuqs';

export const ChangeRequestsPageClient = ({ catalogId, organization, data, FDK_REGISTRATION_BASE_URI }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();
  const design = useCatalogDesign();

  const handleNewConceptSuggestionClick = () => {
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/change-requests/new`);
    }
  };

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

  const [filterItemType, setFilterItemType] = useQueryState(
    'filter.itemType',
    parseAsString.withDefault(itemTypeOptions[0].value),
  );

  const onItemTypeChange = (value: string) => {
    setFilterItemType(value);
  };

  const itemType = {
    options: itemTypeOptions,
    selected: filterItemType,
    onChange: onItemTypeChange,
  };

  let listItems;
  if (filterItemType === 'changeRequest') {
    listItems = data.filter((item) => item.conceptId !== null);
  } else if (filterItemType === 'suggestionForNewConcept') {
    listItems = data.filter((item) => item.conceptId === null);
  } else {
    listItems = data;
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
          <Button onClick={handleNewConceptSuggestionClick}>{loc.suggestionForNewConcept}</Button>
        </div>
        <div className={styles.filterAndListContainer}>
          <Heading
            className={styles.listHeading}
            level={2}
            size='xsmall'
          >
            {loc.changeRequest.changeRequest}
          </Heading>
          <ChangeRequestFilter itemType={itemType} />
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
