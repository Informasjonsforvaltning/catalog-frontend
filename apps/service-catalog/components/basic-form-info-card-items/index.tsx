import { Service } from '@catalog-frontend/types';
import { DividerLine, InfoCard } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
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
        <InfoCard.Item title={`${localization.description}:`}>
          {getTranslateText(service?.description ?? '', language)}
        </InfoCard.Item>
      )}

      {contactPoint && !allPropertiesEmpty(contactPoint) && (
        <InfoCard.Item title={`${localization.serviceCatalog.contactPoint}:`}>
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
                data-size='sm'
                className={styles.content}
              >
                <span className={styles.bold}>{`${localization.email}:`}</span>
                {contactPoint.email}
              </Paragraph>
            )}

            {contactPoint.telephone && (
              <Paragraph
                data-size='sm'
                className={styles.content}
              >
                <span className={styles.bold}>{`${localization.telephone}:`}</span>
                {contactPoint.telephone}
              </Paragraph>
            )}

            {contactPoint.contactPage && (
              <Paragraph
                data-size='sm'
                className={styles.content}
              >
                <span className={styles.bold}>{`${localization.contactPage}:`}</span>
                {contactPoint.contactPage}
              </Paragraph>
            )}
          </div>
        </InfoCard.Item>
      )}
      {produces?.length > 0 && (
        <InfoCard.Item title={`${localization.serviceCatalog.produces}:`}>
          {produces.map((produce, index) => (
            <div key={`produces-details-${index}`}>
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
                <Paragraph
                  data-size='sm'
                  className={styles.content}
                >
                  <span className={styles.bold}>{`${localization.description}:`}</span>
                  {getTranslateText(produce?.description)}
                </Paragraph>
              )}
            </div>
          ))}
        </InfoCard.Item>
      )}
      {homepage && <InfoCard.Item title={`${localization.homepage}:`}>{homepage}</InfoCard.Item>}
    </>
  );
};

export default BasicServiceFormInfoCardItems;
