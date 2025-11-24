import { Service } from "@catalog-frontend/types";
import { DividerLine, InfoCard } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Heading, Paragraph } from "@digdir/designsystemet-react";
import styles from "./basic-form-info-card-items.module.css";

type Props = {
  service: Service;
  language: string;
};

export const BasicServiceFormInfoCardItems = (props: Props) => {
  const { service, language } = props;
  const contactPoint = service.contactPoints?.[0];

  return (
    <InfoCard>
      <InfoCard.Item title={`${localization.description}:`}>
        {getTranslateText(service.description, language)}
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.contactPoint}:`}>
        <Heading size="2xs" level={4} className={styles.heading}>
          {getTranslateText(contactPoint?.category, language) ||
            localization.noName}
        </Heading>

        <DividerLine />

        {contactPoint?.email && (
          <Paragraph size="small" className={styles.content}>
            <span className={styles.bold}>{localization.email}:</span>
            {contactPoint.email}
          </Paragraph>
        )}

        {contactPoint?.telephone && (
          <Paragraph size="small" className={styles.content}>
            <span className={styles.bold}>{localization.telephone}:</span>
            {contactPoint.telephone}
          </Paragraph>
        )}

        {contactPoint?.contactPage && (
          <Paragraph size="small" className={styles.content}>
            <span className={styles.bold}>{localization.contactPage}:</span>
            {contactPoint.contactPage}
          </Paragraph>
        )}
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.produces}:`}>
        {!service.produces?.length && (
          <Paragraph size="small" className={styles.content}>
            {localization.none}
          </Paragraph>
        )}
        {service.produces?.map((produce) => (
          <div key={produce.identifier}>
            <Heading size="2xs" level={4} className={styles.heading}>
              {getTranslateText(produce.title, language) || localization.noName}
            </Heading>

            <DividerLine />

            <Paragraph size="small" className={styles.content}>
              <span className={styles.bold}>{localization.description}:</span>
              {getTranslateText(produce.description, language)}
            </Paragraph>
          </div>
        ))}
      </InfoCard.Item>

      {service.homepage && (
        <InfoCard.Item title={`${localization.homepage}:`}>
          {service.homepage}
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};

export default BasicServiceFormInfoCardItems;
