import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Card, Label, Tag } from '@digdir/designsystemet-react';
import { DistributionDetails } from '../../dataset-form/components/distribution-section/distribution-details';
import styles from '../details-columns.module.css';
import { useSearchFileTypeByUri } from '../../../hooks/useReferenceDataSearch';
import _ from 'lodash';

type Props = {
  distribution: Partial<Distribution>;
  searchEnv: string;
  referenceDataEnv: string;
  openLicenses: ReferenceDataCode[];
  language?: string;
};

export const DistributionDetailsCard = ({
  distribution,
  searchEnv,
  referenceDataEnv,
  openLicenses,
  language,
}: Props) => {
  const { data: formats } = useSearchFileTypeByUri(distribution.format, referenceDataEnv);

  return (
    <Card>
      <div className={styles.infoCardItems}>
        {distribution?.title && !_.isEmpty(distribution?.title) && (
          <div>
            <Label size='sm'>{localization.title}</Label>
            <p>{getTranslateText(distribution?.title, language)}</p>
          </div>
        )}

        {distribution?.accessURL && (
          <div>
            <Label size='sm'>{localization.datasetForm.fieldLabel.accessURL}</Label>
            <p>{distribution?.accessURL}</p>
          </div>
        )}

        {distribution?.format && !_.isEmpty(distribution.format) && (
          <div>
            <Label size='sm'>{localization.datasetForm.fieldLabel.format}</Label>
            <li className={styles.list}>
              {distribution.format?.map((item: string) => {
                const match = formats && formats.find((format: any) => format.uri === item);
                return (
                  <Tag
                    size='sm'
                    color='info'
                    key={item}
                  >
                    {match ? getTranslateText(match?.label, language) : item}
                  </Tag>
                );
              })}
            </li>
          </div>
        )}
      </div>
      <DistributionDetails
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        openLicenses={openLicenses}
        distribution={distribution}
        language={language}
      />
    </Card>
  );
};
