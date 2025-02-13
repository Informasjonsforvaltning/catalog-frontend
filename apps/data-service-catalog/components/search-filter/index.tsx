'use client';

import { memo } from 'react';
import { Accordion } from '@digdir/designsystemet-react';
import { ReferenceDataCode } from '@catalog-frontend/types';
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization as loc,
} from '@catalog-frontend/utils';
import styles from './search-filter.module.css';
import { CheckboxGroupFilter } from './checkbox-group-filter';
import { AccordionItem, AccordionItemProps } from '../accordion-item';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export type PublishedFilterType = 'published' | 'unpublished';

interface Props {
  distributionStatuses?: ReferenceDataCode[];
}

const SearchFilter = ({ distributionStatuses }: Props) => {
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );

  const statusItems =
    distributionStatuses?.map((s) => ({
      value: s.uri,
      label: capitalizeFirstLetter(getTranslateText(s.label) as string),
    })) ?? [];

  const publicationStateItems = [
    { value: 'published' as PublishedFilterType, label: loc.publicationState.published },
    { value: 'unpublished' as PublishedFilterType, label: loc.publicationState.unpublished },
  ];

  const handleOnStatusChange = (names: string[]) => {
    setFilterStatus(names.map((name) => name));
  };

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
  };

  const accordionItemContents: AccordionItemProps[] = [
    ...(statusItems?.length > 0
      ? [
        {
          header: loc.status,
          content: (
            <CheckboxGroupFilter<string>
              items={statusItems}
              onChange={handleOnStatusChange}
              value={filterStatus ?? []}
            />
          ),
        },
      ]
      : []),
    {
      header: loc.publicationState.state,
      content: (
        <>
          <p>
            {loc.publicationState.descriptionDataService}
            <br />
            <br />
          </p>
          <CheckboxGroupFilter<PublishedFilterType>
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
      <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion>
    </div>
  );
};

export default memo(SearchFilter);
