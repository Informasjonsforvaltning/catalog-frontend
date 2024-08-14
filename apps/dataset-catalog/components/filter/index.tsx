import { localization } from '@catalog-frontend/utils';
import { Radio } from '@digdir/designsystemet-react';
import styles from './filter.module.css';
import { PublicationStatus } from '@catalog-frontend/types';

type Props = {
  onStatusChange: (status: string) => void;
};

export const Filter = ({ onStatusChange }: Props) => {
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
        <Radio value={PublicationStatus.PUBLISH}>{localization.datasetCatalog.status.PUBLISH}</Radio>
        <Radio value={PublicationStatus.APPROVE}>{localization.datasetCatalog.status.APPROVE}</Radio>
        <Radio value={PublicationStatus.DRAFT}>{localization.datasetCatalog.status.DRAFT}</Radio>
      </Radio.Group>
    </div>
  );
};

export default Filter;
