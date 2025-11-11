'use client';

import { memo, useMemo } from 'react';
import { Accordion } from '@digdir/designsystemet-react';
import { AccordionItem, AccordionItemProps, CheckboxGroupFilter } from '@catalog-frontend/ui';
import { DatasetsPageSettings, PublicationStatus } from '@catalog-frontend/types';
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

  const [filterStatus, setFilterStatus] = useQueryState(
    'datasetFilter.status',
    parseAsArrayOf(parseAsString).withDefault(defaultFilterStatus),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'datasetFilter.pubState',
    parseAsArrayOf(parseAsString).withDefault(defaultFilterPublicationState),
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

  const handleStatusOnChange = (names: string[]) => {
    setFilterStatus(names.map((name) => name));
  };

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
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
            {localization.publicationState.descriptionConcept}
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
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${item.header}`}            
      {...item}
    />
  ));

  return (
    <div className={styles.searchFilter}>
      {/* <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion> */}
    </div>
  );
};

export default memo(SearchFilter);
