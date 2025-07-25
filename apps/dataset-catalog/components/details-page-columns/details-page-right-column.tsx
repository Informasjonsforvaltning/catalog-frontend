import { InfoCard } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { EnvelopeClosedIcon, PhoneIcon, LinkIcon } from '@navikt/aksel-icons';
import { isEmpty } from 'lodash';
import PublishSwitch from '../publish-switch';
import { Dataset, PublicationStatus } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { Link } from '@digdir/designsystemet-react';

type Props = {
  dataset: Dataset;
  hasWritePermission: boolean;
  language: string;
};

export const RightColumn = ({ dataset, hasWritePermission, language }: Props) => {
  const published = dataset.registrationStatus === PublicationStatus.PUBLISH;

  return (
    <InfoCard>
      <InfoCard.Item
        key={`info-data-${localization.id}`}
        title={localization.datasetForm.fieldLabel.datasetID}
        headingColor='light'
      >
        {dataset?.id}
      </InfoCard.Item>

      <InfoCard.Item
        key={`info-data-${localization.publicationState.state}`}
        title={localization.publicationState.state}
        headingColor='light'
        helpText={
          dataset.registrationStatus === PublicationStatus.DRAFT
            ? `${localization.datasetForm.helptext.publishWarning} [skjemaet.](/catalogs/${dataset?.catalogId}/datasets/${dataset?.id}/edit)`
            : localization.datasetForm.helptext.publish
        }
        helpTextSeverity={dataset.registrationStatus === PublicationStatus.DRAFT ? 'warning' : 'info'}
      >
        <PublishSwitch
          catalogId={dataset.catalogId}
          dataset={dataset}
          disabled={!hasWritePermission}
        />

        {published ? localization.publicationState.publishedInFDK : localization.publicationState.unpublished}
      </InfoCard.Item>

      {dataset?.contactPoint && !isEmpty(dataset?.contactPoint[0]) && (
        <InfoCard.Item
          title={localization.datasetForm.heading.contactPoint}
          headingColor='light'
        >
          <div className={styles.contactPoints}>
            {!isEmpty(dataset?.contactPoint[0]?.name) && (
              <span>{getTranslateText(dataset?.contactPoint[0]?.name, language)}</span>
            )}
            {dataset?.contactPoint[0].email && (
              <span>
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataset?.contactPoint[0]?.email}
              </span>
            )}
            {dataset?.contactPoint[0]?.hasTelephone && (
              <span>
                <div>
                  <PhoneIcon />
                </div>
                {dataset?.contactPoint[0]?.hasTelephone}
              </span>
            )}

            {dataset?.contactPoint[0].hasURL && (
              <span>
                <div>
                  <LinkIcon />
                </div>

                <Link href={dataset?.contactPoint[0].hasURL}>{dataset?.contactPoint[0].hasURL}</Link>
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
