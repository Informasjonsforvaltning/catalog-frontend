'use client';

import { Accordion, Radio } from '@digdir/designsystemet-react';
import { CheckboxGroup } from '@fellesdatakatalog/ui';
import { localization } from '@catalog-frontend/utils';
import { ItemType, Status } from '@catalog-frontend/types';
import styles from './change-request-filter.module.css';

type Props = {
  itemType: ItemType;
  status: Status;
}

const ChangeRequestsFilter = ({ itemType, status }: Props) => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion border>
        <Accordion.Item defaultOpen>
          <Accordion.Header level={3}>{localization.filter}</Accordion.Header>
          <Accordion.Content>
            <Radio.Group
              data-size='sm'
              onChange={itemType.onChange}
              defaultValue={itemType.selected}
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
        </Accordion.Item>
        <Accordion.Item defaultOpen>
          <Accordion.Header level={3}>{localization.status}</Accordion.Header>
          <Accordion.Content>
            <CheckboxGroup
              onChange={status.onChange}
              data-size='sm'
              value={status.selected}
              options={status.options.map((statusItem) => ({ value: statusItem.value, label: statusItem.label }))}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ChangeRequestsFilter;
