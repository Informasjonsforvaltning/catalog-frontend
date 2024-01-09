'use client';

import { Accordion, AccordionItem, Radio } from '@digdir/design-system-react';
import { localization } from '@catalog-frontend/utils';
import styles from './change-request-filter.module.css';
import { ItemType } from '@catalog-frontend/types';

interface Props {
  itemType: ItemType;
}

const ChangeRequestsFilter = ({ itemType }: Props) => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion border>
        <AccordionItem defaultOpen>
          <Accordion.Header level={3}>{localization.filter}</Accordion.Header>
          <Accordion.Content>
            <Radio.Group
              size='small'
              onChange={itemType.onChange}
              defaultValue={itemType.options[0].value}
            >
              {itemType.options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Accordion.Content>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChangeRequestsFilter;
