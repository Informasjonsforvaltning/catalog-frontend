import { InfoCard, Tag } from '@catalog-frontend/ui';
import { formatISO, getTranslateText, localization } from '@catalog-frontend/utils';
import { EnvelopeClosedIcon, PhoneIcon, LinkIcon } from '@navikt/aksel-icons';
import { isEmpty } from 'lodash';
import PublishSwitch from '../publish-switch';
import { Dataset } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { Link } from '@digdir/designsystemet-react';
import { VStack } from '@fellesdatakatalog/ui';

type Props = {
  dataset: Dataset;
  hasWritePermission: boolean;
  language: string;
  referenceDataEnv: string;
};

export const RightColumn = ({ dataset, hasWritePermission, language, referenceDataEnv }: Props) => {
  return (
    <InfoCard>
      <InfoCard.Item
        title={localization.datasetForm.fieldLabel.datasetID}
        headingColor='light'
      >
        {dataset?.id}
      </InfoCard.Item>

      <InfoCard.Item
        title={localization.publicationState.state}
        headingColor='light'
        helpText={
          !(dataset.approved || dataset.published)
            ? `${localization.datasetForm.helptext.publishWarning} [skjemaet.](/catalogs/${dataset?.catalogId}/datasets/${dataset?.id}/edit)`
            : localization.datasetForm.helptext.publish
        }
        helpTextSeverity={!(dataset.approved || dataset.published) ? 'warning' : 'info'}
      >
        <VStack>
          <Tag.PublishedTag published={dataset.published} />
          <PublishSwitch
            catalogId={dataset.catalogId}
            dataset={dataset}
            disabled={!hasWritePermission}
            referenceDataEnv={referenceDataEnv}
          />
        </VStack>
      </InfoCard.Item>

      {dataset?.lastModified && (
        <InfoCard.Item
          title={localization.lastUpdated}
          headingColor='light'
        >
          {formatISO(dataset?.lastModified, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </InfoCard.Item>
      )}

      {dataset?.contactPoints && !isEmpty(dataset?.contactPoints[0]) && (
        <InfoCard.Item
          title={localization.datasetForm.heading.contactPoint}
          headingColor='light'
        >
          <div className={styles.contactPoints}>
            {!isEmpty(dataset?.contactPoints[0]?.name) && (
              <span>{getTranslateText(dataset?.contactPoints[0]?.name, language)}</span>
            )}
            {dataset?.contactPoints[0].email && (
              <span>
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataset?.contactPoints[0]?.email}
              </span>
            )}
            {dataset?.contactPoints[0]?.phone && (
              <span>
                <div>
                  <PhoneIcon />
                </div>
                {dataset?.contactPoints[0]?.phone}
              </span>
            )}

            {dataset?.contactPoints[0].url && (
              <span>
                <div>
                  <LinkIcon />
                </div>

                <Link href={dataset?.contactPoints[0].url}>{dataset?.contactPoints[0].url}</Link>
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
