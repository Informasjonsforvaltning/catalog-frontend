"use client";

import { ReferenceDataCode, Service } from "@catalog-frontend/types";
import {
  DetailsPageLayout,
  InfoCard,
  LinkButton,
  ServiceStatusTagProps,
  Tag,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { DeleteServiceButton } from "../../../../../components/buttons";
import PublishSwitch from "../../../../../components/publish-switch";
import BasicServiceFormInfoCardItems from "../../../../../components/basic-form-info-card-items";
import { useState } from "react";
import styles from "./service-details-page.module.css";
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from "@navikt/aksel-icons";
import { Link } from "@digdir/designsystemet-react";

interface ServiceDetailsPageProps {
  service: Service;
  catalogId: string;
  serviceId: string;
  hasWritePermission: boolean;
  statuses: ReferenceDataCode[];
}

const ServiceDetailsPageClient = ({
  service,
  catalogId,
  serviceId,
  hasWritePermission,
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
        <BasicServiceFormInfoCardItems service={service} language={language} />
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>
        <InfoCard>
          <InfoCard.Item title={localization.id} headingColor="light">
            <p>{service.id}</p>
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

            <p className={styles.greyFont}>
              {service.published
                ? localization.publicationState.publishedInFDK
                : localization.publicationState.unpublished}
            </p>
          </InfoCard.Item>

          <InfoCard.Item
            title={localization.serviceCatalog.contactPoint}
            headingColor="light"
          >
            <div className={styles.contactPoints}>
              <span>
                {getTranslateText(contactPoint?.category, language) ||
                  localization.noName}
              </span>

              {contactPoint?.email && (
                <span>
                  <div>
                    <EnvelopeClosedIcon />
                  </div>

                  {contactPoint.email}
                </span>
              )}
              {contactPoint?.telephone && (
                <span>
                  <div>
                    <PhoneIcon />
                  </div>
                  {contactPoint.telephone}
                </span>
              )}

              {contactPoint?.contactPage && (
                <span>
                  <div>
                    <LinkIcon />
                  </div>

                  <Link href={contactPoint.contactPage}>
                    {contactPoint.contactPage}
                  </Link>
                </span>
              )}
            </div>
          </InfoCard.Item>
        </InfoCard>
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.actionButtons}>
            <LinkButton
              href={`/catalogs/${catalogId}/services/${serviceId}/edit`}
            >
              {localization.serviceCatalog.editService}
            </LinkButton>

            <DeleteServiceButton
              catalogId={catalogId}
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
