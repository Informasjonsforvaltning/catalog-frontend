import { Service } from '@catalog-frontend/types';
import { DividerLine, InfoCard } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Label, Paragraph } from '@digdir/design-system-react';
import styles from './basic-form-info-card-items.module.css';
import _ from 'lodash';

type Props = {
  service?: Service;
  language?: string;
};

export const BasicServiceFormInfoCardItems = ({ service, language }: Props) => {
  const produces = service?.produces || [];
  const contactPoint = service?.contactPoints && service?.contactPoints[0];
  const homepage = service?.homepage;

  // Check if all properties within an object are empty
  const allPropertiesEmpty = (obj: any): boolean => {
    return _.every(_.values(obj), _.isEmpty);
  };

  return (
    <>
      {getTranslateText(service?.description) && (
        <InfoCard.Item label={`${localization.description}:`}>
          {getTranslateText(service?.description ?? '', language)}
        </InfoCard.Item>
      )}

      {contactPoint && !allPropertiesEmpty(contactPoint) && (
        <InfoCard.Item label={`${localization.serviceCatalog.contactPoint}:`}>
          <div>
            {contactPoint?.category && !_.isEmpty(contactPoint.category) && (
              <Heading
                size='xxsmall'
                level={4}
                className={styles.heading}
              >
                {getTranslateText(service?.contactPoints && service?.contactPoints[0].category)}
              </Heading>
            )}

            <DividerLine />

            {contactPoint.email && (
              <Paragraph
                size='small'
                className={styles.content}
              >
                <p className={styles.bold}>{`${localization.email}:`}</p>
                {contactPoint.email}
              </Paragraph>
            )}

            {contactPoint.telephone && (
              <Paragraph
                size='small'
                className={styles.content}
              >
                <p className={styles.bold}>{`${localization.telephone}:`}</p>
                {contactPoint.telephone}
              </Paragraph>
            )}

            {contactPoint.contactPage && (
              <Paragraph
                size='small'
                className={styles.content}
              >
                <p className={styles.bold}>{`${localization.contactPage}:`}</p>
                {contactPoint.contactPage}
              </Paragraph>
            )}
          </div>
        </InfoCard.Item>
      )}
      {produces?.length > 0 && (
        <InfoCard.Item label={`${localization.serviceCatalog.produces}:`}>
          {produces.map((produce, index) => (
            <div key={index}>
              {produce?.title && (
                <>
                  <Heading
                    size='xxsmall'
                    level={4}
                    className={styles.heading}
                  >
                    {getTranslateText(produce?.title)}
                  </Heading>

                  <DividerLine />
                </>
              )}

              {produce?.description && (
                <div className={styles.content}>
                  <Label size='small'>{`${localization.description}:`}</Label>
                  <Paragraph size='small'>{getTranslateText(produce?.description)}</Paragraph>
                </div>
              )}
            </div>
          ))}
        </InfoCard.Item>
      )}
      {homepage && <InfoCard.Item label={`${localization.homepage}:`}>{homepage}</InfoCard.Item>}
    </>
  );
};

export default BasicServiceFormInfoCardItems;
