import { InfoCard } from '@catalog-frontend/ui';
import styles from './details-columns.module.css';
import { DataService } from '@catalog-frontend/types';
import { formatISO, localization } from '@catalog-frontend/utils';
import { isEmpty } from 'lodash';
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from '@navikt/aksel-icons';
import PublishSwitch from '../publish-switch';

type Props = {
  dataService: DataService;
  hasWritePermission: boolean;
};

export const RightColumn = ({ dataService, hasWritePermission }: Props) => {
  return (
    <InfoCard>
      <InfoCard.Item
        key={`info-data-${localization.id}`}
        title={localization.dataServiceForm.fieldLabel.dataServiceID}
        headingColor='light'
      >
        {dataService?.id}
      </InfoCard.Item>

      <InfoCard.Item
        key={`info-data-${localization.publicationState.state}`}
        title={localization.publicationState.state}
        headingColor='light'
      >
        <PublishSwitch
          catalogId={dataService.catalogId}
          dataService={dataService}
          disabled={!hasWritePermission}
        />
        <div className={styles.greyFont}>
          {dataService.published
            ? `${localization.publicationState.publishedInFDK}${
                dataService.publishedDate
                  ? ' ' +
                    formatISO(dataService.publishedDate, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''
              }`
            : ''}
        </div>
      </InfoCard.Item>

      {dataService?.modified && (
        <InfoCard.Item
          title={localization.dataServiceForm.fieldLabel.modified}
          headingColor='light'
        >
          {new Date(dataService.modified).toLocaleDateString('no-NO')}
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.contactPoint) && (
        <InfoCard.Item
          title={localization.dataServiceForm.heading.contactPoint}
          headingColor='light'
        >
          <div className={styles.contactPoints}>
            {dataService.contactPoint.email && (
              <span>
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataService?.contactPoint.email}
              </span>
            )}
            {dataService.contactPoint?.phone && (
              <span>
                <div>
                  <PhoneIcon />
                </div>
                {dataService?.contactPoint.phone}
              </span>
            )}
            {dataService.contactPoint.url && (
              <span>
                <div>
                  <LinkIcon />
                </div>

                {dataService?.contactPoint.url}
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
