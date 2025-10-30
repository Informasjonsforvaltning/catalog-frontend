'use client';

import { Accordion, Checkbox, Radio } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { ItemType, Status } from '@catalog-frontend/types';
import styles from './change-request-filter.module.css';

type Props = {
  itemType: ItemType;
  status: Status;
};

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
            <Checkbox.Group
              onChange={status.onChange}
              size='small'
              defaultValue={status.selected}
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
