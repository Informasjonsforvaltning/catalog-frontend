import { InfoCard } from '@catalog-frontend/ui';
import styles from './details-columns.module.css';
import { DataService } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { isEmpty } from 'lodash';
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from '@navikt/aksel-icons';

type Props = {
  dataService: DataService;
};

export const RightColumn = ({ dataService }: Props) => {
  return (
    <InfoCard>
      <InfoCard.Item
        key={`info-data-${localization.id}`}
        title={localization.dataServiceForm.fieldLabel.dataServiceID}
        headingColor='light'
      >
        {dataService?.id}
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
            {dataService.contactPoint.organizationUnit && (
              <span>
                <div>
                  <LinkIcon />
                </div>
                <div>{dataService.contactPoint.organizationUnit}</div>
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
