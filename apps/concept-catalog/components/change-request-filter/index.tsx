'use client';

import { Accordion, Checkbox, Radio } from '@digdir/design-system-react';
import { localization } from '@catalog-frontend/utils';
import styles from './change-request-filter.module.css';
import { ItemType, Status } from '@catalog-frontend/types';

interface Props {
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
        </Accordion.Item>
        <Accordion.Item defaultOpen>
          <Accordion.Header level={3}>{localization.status}</Accordion.Header>
          <Accordion.Content>
            <Checkbox.Group
              onChange={status.onChange}
              size='small'
            >
              {status.options.map((statusItem) => (
                <Checkbox
                  key={statusItem.value}
                  value={statusItem.value}
                >
                  {statusItem.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ChangeRequestsFilter;
