import { InfoCard } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, formatISO, localization } from '@catalog-frontend/utils';
import { EnvelopeClosedIcon, PhoneIcon, LinkIcon } from '@navikt/aksel-icons';
import _ from 'lodash';
import PublishSwitch from '../publish-switch';
import { Dataset } from '@catalog-frontend/types';
import styles from './details-columns.module.css';

type Props = {
  dataset: Dataset;
  hasWritePermission: boolean;
};

export const RightColumn = ({ dataset, hasWritePermission }: Props) => {
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
        helpText={
          dataset.approved
            ? localization.datasetForm.helptext.publish
            : `${localization.datasetForm.helptext.publishWarning} [skjemaet.](/catalogs/${dataset?.catalogId}/dataset/${dataset?.id}/edit)`
        }
        headingColor='light'
        helpTextSeverity={dataset.approved ? 'info' : 'warning'}
      >
        <PublishSwitch
          catalogId={dataset.catalogId}
          dataset={dataset}
          disabled={!hasWritePermission}
        />

        {dataset.published ? localization.publicationState.publishedInFDK : localization.publicationState.unpublished}
      </InfoCard.Item>

      {dataset?.issued && (
        <InfoCard.Item
          title={localization.datasetForm.fieldLabel.issued}
          headingColor='light'
        >
          {capitalizeFirstLetter(
            formatISO(dataset.issued, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          )}
        </InfoCard.Item>
      )}

      {dataset?.contactPoints && !_.isEmpty(dataset?.contactPoints[0]) && (
        <InfoCard.Item
          title={localization.concept.contactInformation}
          headingColor='light'
        >
          <div className={styles.contactPoints}>
            {dataset?.contactPoints[0].email && (
              <span>
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataset?.contactPoints[0].email}
              </span>
            )}
            {dataset?.contactPoints[0].phone && (
              <span>
                <div>
                  <PhoneIcon />
                </div>
                {dataset?.contactPoints[0].phone}
              </span>
            )}

            {dataset?.contactPoints[0].url && (
              <span>
                <div>
                  <LinkIcon />
                </div>

                {dataset?.contactPoints[0].url}
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
          {capitalizeFirstLetter(
            formatISO(dataset.modified, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          )}
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
