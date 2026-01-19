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
import styles from "./public-service-details-page.module.css";

interface PublicServiceDetailsPageProps {
  catalogId: string;
  hasWritePermission: boolean;
  referenceDataEnv: string;
  service: Service;
  serviceId: string;
  statuses: ReferenceDataCode[];
}

const PublicServiceDetailsPageClient = ({
  catalogId,
  hasWritePermission,
  referenceDataEnv,
  service,
  serviceId,
  statuses,
}: PublicServiceDetailsPageProps) => {
  const [language, setLanguage] = useState("nb");
  const status = statuses.find((item) => item.uri === service.status);

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
          service={service}
        />
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
              type="public-services"
              disabled={!hasWritePermission}
            />

            <p className={styles.greyFont}>
              {service.published
                ? localization.publicationState.publishedInFDK
                : localization.publicationState.unpublished}
            </p>
          </InfoCard.Item>
        </InfoCard>
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.actionButtons}>
            <LinkButton
              href={`/catalogs/${catalogId}/public-services/${serviceId}/edit`}
            >
              {localization.serviceCatalog.editPublicService}
            </LinkButton>

            <DeleteServiceButton
              catalogId={catalogId}
              serviceId={serviceId}
              type="public-services"
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default PublicServiceDetailsPageClient;
