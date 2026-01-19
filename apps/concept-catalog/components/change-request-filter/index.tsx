'use client';

import { Details, Radio } from '@digdir/designsystemet-react';
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
      <Details defaultOpen>
        <Details.Summary>{localization.filter}</Details.Summary>
        <Details.Content>
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
        </Details.Content>
      </Details>
      <Details defaultOpen>
        <Details.Summary>{localization.status}</Details.Summary>
        <Details.Content>
          <CheckboxGroup
            onChange={status.onChange}
            data-size='sm'
            value={status.selected}
            options={status.options.map((statusItem) => ({ value: statusItem.value, label: statusItem.label }))}
          />
        </Details.Content>
      </Details>
    </div>
  );
};

export default ChangeRequestsFilter;
