import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Card, Heading, Tag } from '@digdir/designsystemet-react';
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
            <Heading
              level={4}
              size='2xs'
            >
              {localization.title}
            </Heading>
            <p>{getTranslateText(distribution?.title, language)}</p>
          </div>
        )}

        {distribution?.accessURL && (
          <div>
            <Heading
              level={4}
              size='2xs'
            >
              {localization.datasetForm.fieldLabel.accessURL}
            </Heading>
            <p>{distribution?.accessURL}</p>
          </div>
        )}

        {distribution?.format && !_.isEmpty(distribution.format) && (
          <div>
            <Heading
              level={4}
              size='2xs'
            >
              {localization.datasetForm.fieldLabel.format}
            </Heading>
            <li className={styles.list}>
              {distribution.format?.map((item: string, index) => {
                const match = formats && formats.find((format: any) => format?.uri === item);
                return (
                  <Tag
                    size='sm'
                    color='info'
                    key={`distributionformat-${index}`}
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
