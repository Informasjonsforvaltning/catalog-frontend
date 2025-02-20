import { DataService } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { InfoCard } from '@catalog-frontend/ui';
import { isEmpty } from 'lodash';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Paragraph, Tag } from '@digdir/designsystemet-react';

type Props = {
  dataService: DataService;
  language: string;
};

export const LeftColumn = ({ dataService, language }: Props) => {
  return (
    <InfoCard>
      {!isEmpty(dataService?.description) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.description}>
          <Paragraph size='sm'>{getTranslateText(dataService?.description, language)} </Paragraph>
        </InfoCard.Item>
      )}
      {!isEmpty(dataService?.keywords) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.keywords}>
          <li className={styles.list}>
            {(getTranslateText(dataService?.keywords, language) as string[])?.map((item, index) => {
              return item ? (
                <Tag
                  size='sm'
                  color='info'
                  key={`keyword-tag-${index}`}
                >
                  {item}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
