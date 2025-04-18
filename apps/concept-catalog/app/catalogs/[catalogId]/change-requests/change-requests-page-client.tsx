'use client';

import { ChangeRequestStatusTagProps, LinkButton, SearchField, SearchHitsLayout, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization,
  sortAscending,
  sortDescending,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { Chip, Heading, Tabs } from '@digdir/designsystemet-react';
import cn from 'classnames';
import Link from 'next/link';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import ChangeRequestFilter from '../../../../components/change-request-filter';
import ChangeRequestSort from '../../../../components/change-request-sort';
import styles from './change-requests-page.module.css';
import { getTranslatedStatus } from '../../../../utils/change-request';
import { useRouter } from 'next/navigation';
import { ChangeRequest } from '@catalog-frontend/types';
import { isEmpty } from 'lodash';

export const ChangeRequestsPageClient = ({ catalogId, data }) => {
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

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useQueryState('search', { defaultValue: '' });
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

  let listItems: ChangeRequest[];
  if (filterItemType === 'changeRequest') {
    listItems = data.filter((item) => item.conceptId !== null);
  } else if (filterItemType === 'suggestionForNewConcept') {
    listItems = data.filter((item) => item.conceptId === null);
  } else {
    listItems = data;
  }

  if (searchTerm) {
    const lowercasedQuery = searchTerm.toLowerCase();
    listItems = listItems.filter((item) => item?.title.toLowerCase().includes(lowercasedQuery));
  }

  if (filterStatus && filterStatus.length > 0) {
    listItems = listItems.filter((item) => filterStatus.includes(item.status.toLowerCase()));
  }

  switch (sort) {
    case 'TIME_FOR_PROPOSAL_ASC':
      listItems = listItems.sort((a, b) => sortAscending(a.timeForProposal ?? '', b.timeForProposal ?? ''));
      break;
    case 'TIME_FOR_PROPOSAL_DESC':
      listItems = listItems.sort((a, b) => sortDescending(a.timeForProposal ?? '', b.timeForProposal ?? ''));
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

  const removeFilter = (filterName: string, filterType: 'status' | 'type') => {
    if (filterType === 'type') {
      setFilterItemType(null);
    } else if (filterType === 'status') {
      setFilterStatus(filterStatus?.filter((name) => name !== filterName) ?? []);
    }
  };

  return (
    <div className='container'>
      <Tabs
        className={styles.tabs}
        defaultValue={'changeRequestTab'}
        size='medium'
      >
        <Tabs.List className={styles.tabsList}>
          <Tabs.Tab
            value={'conceptTab'}
            onClick={() => router.push(`/catalogs/${catalogId}/concepts`)}
          >
            {localization.concept.concepts}
          </Tabs.Tab>
          <Tabs.Tab value={'changeRequestTab'}>{localization.changeRequest.changeRequest}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content
          value={'changeRequestTab'}
          className={styles.tabsContent}
        >
          <SearchHitsLayout>
            <SearchHitsLayout.SearchRow>
              <div className={styles.searchRow}>
                <div className={styles.searchFieldWrapper}>
                  <SearchField
                    className={styles.searchField}
                    placeholder={`${localization.search.search}...`}
                    value={searchTerm}
                    onSearch={(value) => {
                      setSearchTerm(value);
                    }}
                  />
                  <ChangeRequestSort
                    options={sortOptions}
                    selected={sort}
                    onChange={onSortChange}
                  />
                </div>
                <LinkButton href={`/catalogs/${catalogId}/change-requests/new`}>
                  {localization.suggestionForNewConcept}
                </LinkButton>
              </div>
            </SearchHitsLayout.SearchRow>
            <SearchHitsLayout.LeftColumn>
              <ChangeRequestFilter
                itemType={itemType}
                status={status}
              />
            </SearchHitsLayout.LeftColumn>
            <SearchHitsLayout.MainColumn>
              {listItems && listItems.length !== 0 ? (
                <div className={styles.listWrapper}>
                  <ul className={styles.list}>
                    {listItems.map(({ id, title, catalogId, timeForProposal, proposedBy, status }) => (
                      <li
                        key={id}
                        itemID={id ?? ''}
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
                                    ? `/catalogs/${catalogId}/change-requests/${id}`
                                    : '#'
                                }
                                className={title ? styles.heading : cn(styles.heading, styles.noName)}
                              >
                                {title || `(${localization.changeRequest.noName})`}
                              </Link>
                            </Heading>
                            <div className={styles.text}>
                              <p>
                                {localization.created}: {convertTimestampToDateAndTime(timeForProposal ?? '')}{' '}
                                {localization.by}{' '}
                                {(proposedBy?.name ?? '')
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
            </SearchHitsLayout.MainColumn>
          </SearchHitsLayout>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default ChangeRequestsPageClient;
