'use client';

import { localization as loc } from '@catalog-frontend/utils';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import styles from './import-filter.module.css';
import { AccordionItem, AccordionItemProps } from '../../../accordion-item';
import { CheckboxGroupFilter } from '../../../checkbox-group-filter';
import { Accordion } from '@digdir/designsystemet-react';

interface Props {
  importStatuses: { value: string; label: string }[];
}

const ImportFilter = ({ importStatuses }: Props) => {
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));

  const accordionItemContents: AccordionItemProps[] = [
    ...(importStatuses?.length > 0
      ? [
          {
            header: loc.status,
            content: (
              <CheckboxGroupFilter<string>
                items={importStatuses}
                onChange={(values) => {
                  setFilterStatus(values);
                }}
                value={filterStatus ?? []}
              />
            ),
          },
        ]
      : []),
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${item.header}`}
      {...item}
    />
  ));

  return (
    <div className={styles.importFilter}>
      <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion>
    </div>
  );
};

export { ImportFilter };
