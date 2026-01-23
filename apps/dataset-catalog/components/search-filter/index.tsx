'use client';

import { memo, useMemo } from 'react';
import { AccordionItem, AccordionItemProps, CheckboxGroupFilter } from '@catalog-frontend/ui';
import { ApplicationProfile, DatasetsPageSettings, PublicationStatus } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import styles from './search-filter.module.css';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export type PublishedFilterType = PublicationStatus.PUBLISH | 'unpublish';

export type InternalFieldFilterType = {
  id: string;
  value: string;
};

type SearchFilterProps = {
  pageSettings?: DatasetsPageSettings; 
};

const SearchFilter = ({ pageSettings }: SearchFilterProps) => {
  const datasetStatuses = [PublicationStatus.APPROVE, PublicationStatus.DRAFT];

  // Memoize default values for query states
  const defaultFilterStatus = useMemo(() => pageSettings?.filter?.status ?? [], []);
  const defaultFilterPublicationState = useMemo(() => pageSettings?.filter?.pubState ?? [], []);
  const defaultFilterApplicationProfile = useMemo(() => pageSettings?.filter?.applicationProfile ?? [], []);

  const [filterStatus, setFilterStatus] = useQueryState(
    'datasetFilter.status',
    parseAsArrayOf(parseAsString).withDefault(defaultFilterStatus),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'datasetFilter.pubState',
    parseAsArrayOf(parseAsString).withDefault(defaultFilterPublicationState),
  );
  const [filterApplicationProfile, setFilterApplicationProfile] = useQueryState(
    'datasetFilter.applicationProfile',
    parseAsArrayOf(parseAsString).withDefault(defaultFilterApplicationProfile),
  );

  const statusItems =
    datasetStatuses?.map((s) => ({
      value: s,
      label: localization.datasetForm?.filter?.[s],
    })) ?? [];

  const publicationStateItems = [
    { value: PublicationStatus.PUBLISH, label: localization.publicationState.published },
    { value: 'UNPUBLISH', label: localization.publicationState.unpublished },
  ];

  const applicationProfileItems = [
    {
      value: ApplicationProfile.MOBILITYDCATAP,
      label: localization.tag.mobilityDcatAp,
    },
    {
      value: ApplicationProfile.DCATAPNO,
      label: localization.tag.dcatApNo,
    },
  ];

  const handleStatusOnChange = (names: string[]) => {
    setFilterStatus(names.map((name) => name));
  };

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
  };

  const handleApplicationProfileOnChange = (names: string[]) => {
    setFilterApplicationProfile(
      names.map((name) => name as ApplicationProfile),
    );
  };

  const accordionItemContents: AccordionItemProps[] = [
    ...(statusItems?.length > 0
      ? [
          {
            initiallyOpen: true,
            header: localization.status,
            content: (
              <CheckboxGroupFilter<string>
                items={statusItems}
                onChange={handleStatusOnChange}
                value={filterStatus ?? []}
              />
            ),
          },
        ]
      : []),
    {
      initiallyOpen: true,
      header: localization.publicationState.state,
      content: (
        <>
          <p>
            {localization.publicationState.descriptionDataset}
            <br />
            <br />
          </p>
          <CheckboxGroupFilter
            items={publicationStateItems}
            onChange={handlePublicationOnChange}
            value={filterPublicationState ?? []}
          />
        </>
      ),
    },
    {
      initiallyOpen: true,
      header: localization.tag.applicationProfile,
      content: (
        <CheckboxGroupFilter
          items={applicationProfileItems}
          onChange={handleApplicationProfileOnChange}
          value={filterApplicationProfile ?? []}
        />
      ),
    },
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${item.header}`}            
      {...item}
    />
  ));

  return (
    <div className={styles.searchFilter}>
      {accordionItems}
    </div>
  );
};

export default memo(SearchFilter);
