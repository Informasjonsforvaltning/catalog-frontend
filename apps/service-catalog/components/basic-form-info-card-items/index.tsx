import { Service } from '@catalog-frontend/types';
import { DividerLine, InfoCard } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Label, Paragraph } from '@digdir/design-system-react';
import styles from './basic-form-info-card-items.module.css';

type Props = {
  service?: Service;
  language?: string;
};

export const BasicServiceFormInfoCardItems = ({ service, language }: Props) => {
  const produces = service?.produces || [];
  const contactPoint = service?.contactPoints && service?.contactPoints[0];
  const homepage = service?.homepage;

  return (
    <>
      <InfoCard.Item label={`${localization.description}:`}>
        {getTranslateText(service?.description ?? '', language)}
      </InfoCard.Item>

      {contactPoint && (
        <InfoCard.Item label={`${localization.serviceCatalog.contactPoint}:`}>
          <div>
            {contactPoint.category.nb && (
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
              <div className={styles.content}>
                <Label size='small'>{`${localization.email}:`}</Label>
                <Paragraph size='small'>{contactPoint.email}</Paragraph>
              </div>
            )}

            {contactPoint.telephone && (
              <div className={styles.content}>
                <Label size='small'>{`${localization.telephone}:`}</Label>
                <Paragraph size='small'>{contactPoint.telephone}</Paragraph>
              </div>
            )}

            {contactPoint.contactPage && (
              <div className={styles.content}>
                <Label size='small'>{`${localization.contactPage}:`}</Label>
                <Paragraph size='small'>{contactPoint.contactPage}</Paragraph>
              </div>
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
