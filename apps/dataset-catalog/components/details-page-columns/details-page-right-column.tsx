import { InfoCard } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { EnvelopeClosedIcon, PhoneIcon, LinkIcon } from '@navikt/aksel-icons';
import _ from 'lodash';
import PublishSwitch from '../publish-switch';
import { Dataset, PublicationStatus } from '@catalog-frontend/types';
import styles from './details-columns.module.css';

type Props = {
  dataset: Dataset;
  hasWritePermission: boolean;
};

export const RightColumn = ({ dataset, hasWritePermission }: Props) => {
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
        helpText={localization.datasetForm.helptext.publish}
        headingColor='light'
      >
        <PublishSwitch
          catalogId={dataset.catalogId}
          dataset={dataset}
          disabled={!hasWritePermission}
        />

        {published ? localization.publicationState.publishedInFDK : localization.publicationState.unpublished}
      </InfoCard.Item>

      {dataset?.issued && (
        <InfoCard.Item
          title={localization.datasetForm.fieldLabel.issued}
          headingColor='light'
        >
          {new Date(dataset.issued).toLocaleDateString('no-NO')}
        </InfoCard.Item>
      )}

      {dataset?.contactPoint && !_.isEmpty(dataset?.contactPoint[0]) && (
        <InfoCard.Item
          title={localization.concept.contactInformation}
          headingColor='light'
        >
          <div className={styles.contactPoints}>
            {dataset?.contactPoint[0].email && (
              <span>
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataset?.contactPoint[0].email}
              </span>
            )}
            {dataset?.contactPoint[0].hasTelephone && (
              <span>
                <div>
                  <PhoneIcon />
                </div>
                {dataset?.contactPoint[0].hasTelephone}
              </span>
            )}

            {dataset?.contactPoint[0].hasURL && (
              <span>
                <div>
                  <LinkIcon />
                </div>

                {dataset?.contactPoint[0].hasURL}
              </span>
            )}
            {dataset?.contactPoint[0].organizationUnit && (
              <span>
                <div>
                  <LinkIcon />
                </div>
                <div>{dataset?.contactPoint[0].organizationUnit}</div>
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.modified && (
        <InfoCard.Item
          title={localization.datasetForm.helptext.modified.slice(0, -1)}
          headingColor='light'
        >
          {new Date(dataset.modified).toLocaleDateString('no-NO')}
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
