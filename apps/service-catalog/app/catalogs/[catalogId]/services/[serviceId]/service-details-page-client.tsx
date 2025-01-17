'use client';

import { ReferenceDataCode, Service } from '@catalog-frontend/types';
import { DetailsPageLayout, InfoCard, LinkButton, ServiceStatusTagProps, Tag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import _ from 'lodash';
import { DeleteServiceButton } from '../../../../../components/buttons';
import PublishSwitch from '../../../../../components/publish-switch';
import BasicServiceFormInfoCardItems from '../../../../../components/basic-form-info-card-items';
import { useState } from 'react';
import styles from './service-details-page.module.css';

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
  const [language, setLanguage] = useState('nb');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const findServiceStatus = () => statuses.find((s) => s.uri === service?.status);

  const RightColumn = () => (
    <div>
      <InfoCard>
        <InfoCard.Item
          key={`info-data-${localization.id}`}
          title={localization.id}
          headingColor='light'
        >
          <span>{service?.id}</span>
        </InfoCard.Item>

        <InfoCard.Item
          key={`info-data-${localization.publicationState.state}`}
          title={localization.publicationState.state}
          headingColor='light'
        >
          <PublishSwitch
            catalogId={catalogId}
            serviceId={serviceId}
            isPublished={service?.published ?? false}
            type='services'
            disabled={!hasWritePermission}
          />

          <div className={styles.greyFont}>
            {service?.published
              ? localization.publicationState.publishedInFDK
              : localization.publicationState.unpublished}
          </div>
        </InfoCard.Item>
      </InfoCard>
    </div>
  );

  return (
    <DetailsPageLayout
      handleLanguageChange={handleLanguageChange}
      language={language}
      headingTitle={getTranslateText(service?.title ?? '', language)}
      headingTag={
        <Tag.ServiceStatus
          statusKey={findServiceStatus()?.code as ServiceStatusTagProps['statusKey']}
          statusLabel={getTranslateText(findServiceStatus()?.label) as string}
        />
      }
      loading={false}
    >
      <DetailsPageLayout.Left>
        <InfoCard>
          {!_.isEmpty(getTranslateText(service?.description ?? '', language)) && (
            <BasicServiceFormInfoCardItems
              service={service}
              language={language}
            />
          )}
        </InfoCard>
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>
        <RightColumn />
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.actionButtons}>
            <LinkButton href={`/catalogs/${catalogId}/services/${serviceId}/edit`}>
              {localization.serviceCatalog.editService}
            </LinkButton>

            <DeleteServiceButton
              catalogId={catalogId}
              serviceId={serviceId}
              type='services'
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default ServiceDetailsPageClient;
