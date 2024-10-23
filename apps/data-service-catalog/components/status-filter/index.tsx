import { localization } from '@catalog-frontend/utils';
import { Radio } from '@digdir/designsystemet-react';
import styles from './status-filter.module.css';

type Props = {
  onStatusChange: (status: string) => void;
};

export const StatusFilter = ({ onStatusChange }: Props) => {
  return (
    <div className={styles.filter}>
      <Radio.Group
        error=''
        legend='Filtrer på status'
        size='md'
        onChange={(value) => onStatusChange(value)}
        defaultValue='ALL'
      >
        <Radio value='ALL'>{localization.tag.all}</Radio>
        <Radio value='PUBLISHED'>{localization.dataServiceCatalog.status.PUBLISHED}</Radio>
        <Radio value='DRAFT'>{localization.dataServiceCatalog.status.DRAFT}</Radio>
      </Radio.Group>
    </div>
  );
};

export default StatusFilter;
