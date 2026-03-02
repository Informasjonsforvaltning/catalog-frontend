"use client";

import { ReferenceDataCode, Service } from "@catalog-frontend/types";
import {
  DetailsPageLayout,
  InfoCard,
  LinkButton,
  ServiceStatusTagProps,
  Tag,
} from "@catalog-frontend/ui-v2";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { DeleteServiceButton } from "../../../../../components/buttons";
import PublishSwitch from "../../../../../components/publish-switch";
import BasicServiceFormInfoCardItems from "../../../../../components/basic-form-info-card-items";
import { useState } from "react";
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from "@navikt/aksel-icons";
import { Link, Paragraph } from "@digdir/designsystemet-react";
import styles from "./service-details-page.module.css";

interface ServiceDetailsPageProps {
  catalogId: string;
  hasWritePermission: boolean;
  referenceDataEnv: string;
  searchEnv: string;
  service: Service;
  serviceId: string;
  statuses: ReferenceDataCode[];
}

const ServiceDetailsPageClient = ({
  catalogId,
  hasWritePermission,
  referenceDataEnv,
  searchEnv,
  service,
  serviceId,
  statuses,
}: ServiceDetailsPageProps) => {
  const [language, setLanguage] = useState("nb");
  const status = statuses.find((item) => item.uri === service.status);
  const contactPoint = service.contactPoints?.[0];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <DetailsPageLayout
      handleLanguageChange={handleLanguageChange}
      language={language}
      headingTitle={getTranslateText(service.title, language)}
      headingTag={
        status?.code &&
        status?.label && (
          <Tag.ServiceStatus
            statusKey={status.code as ServiceStatusTagProps["statusKey"]}
            statusLabel={getTranslateText(status.label)}
          />
        )
      }
    >
      <DetailsPageLayout.Left>
        <BasicServiceFormInfoCardItems
          language={language}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
          service={service}
        />
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>
        <InfoCard>
          <InfoCard.Item title={localization.id} headingColor="light">
            <Paragraph data-size="sm">{service.id}</Paragraph>
          </InfoCard.Item>

          <InfoCard.Item
            title={localization.publicationState.state}
            headingColor="light"
          >
            <PublishSwitch
              catalogId={catalogId}
              serviceId={serviceId}
              isPublished={service.published}
              type="services"
              disabled={!hasWritePermission}
            />

            <Paragraph className={styles.greyFont} data-size="sm">
              {service.published
                ? localization.publicationState.publishedInFDK
                : localization.publicationState.unpublished}
            </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item
            title={localization.serviceCatalog.contactPoint}
            headingColor="light"
          >
            <div className={styles.contactPoints}>
              <Paragraph data-size="sm">
                {getTranslateText(contactPoint?.category, language) ||
                  localization.noName}
              </Paragraph>

              {contactPoint?.email && (
                <Paragraph className={styles.contactPoint} data-size="sm">
                  <EnvelopeClosedIcon />
                  {contactPoint.email}
                </Paragraph>
              )}
              {contactPoint?.telephone && (
                <Paragraph className={styles.contactPoint} data-size="sm">
                  <PhoneIcon />
                  {contactPoint.telephone}
                </Paragraph>
              )}

              {contactPoint?.contactPage && (
                <Paragraph className={styles.contactPoint} data-size="sm">
                  <LinkIcon />
                  <Link href={contactPoint.contactPage}>
                    {contactPoint.contactPage}
                  </Link>
                </Paragraph>
              )}
            </div>
          </InfoCard.Item>
        </InfoCard>
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.actionButtons}>
            <LinkButton
              data-size="sm"
              href={`/catalogs/${catalogId}/services/${serviceId}/edit`}
            >
              {localization.serviceCatalog.editService}
            </LinkButton>

            <DeleteServiceButton
              catalogId={catalogId}
              published={service.published}
              serviceId={serviceId}
              type="services"
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default ServiceDetailsPageClient;
