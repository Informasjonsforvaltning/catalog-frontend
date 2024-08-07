'use client';
import { ReferenceDataCode, Service } from '@catalog-frontend/types';
import { Button, DetailsPageLayout, InfoCard, LinkButton, ServiceStatusTagProps, Tag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { DeleteServiceButton } from '../../../../../components/buttons';
import PublishSwitch from '../../../../../components/publish-switch';
import BasicServiceFormInfoCardItems from '../../../../../components/basic-form-info-card-items';
import { useState } from 'react';
import styles from './public-service-details-page.module.css';
import _ from 'lodash';

interface PublicServiceDetailsPageProps {
  service: Service;
  catalogId: string;
  serviceId: string;
  hasWritePermission: boolean;
  statuses: ReferenceDataCode[];
}

const PublicServiceDetailsPageClient = ({
  service,
  catalogId,
  serviceId,
  hasWritePermission,
  statuses,
}: PublicServiceDetailsPageProps) => {
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
          label={localization.id}
          labelColor='light'
        >
          <span>{service?.id}</span>
        </InfoCard.Item>

        <InfoCard.Item
          key={`info-data-${localization.publicationState.state}`}
          label={localization.publicationState.state}
          labelColor='light'
        >
          <PublishSwitch
            catalogId={catalogId}
            serviceId={serviceId}
            isPublished={!!service?.published}
            type='public-services'
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
        {
          <InfoCard>
            {!_.isEmpty(getTranslateText(service?.description ?? '', language)) && (
              <BasicServiceFormInfoCardItems
                service={service}
                language={language}
              />
            )}
          </InfoCard>
        }
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>{<RightColumn />}</DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.actionButtons}>
            <LinkButton href={`/catalogs/${catalogId}/public-services/${serviceId}/edit`}>
              {localization.serviceCatalog.editPublicService}
            </LinkButton>

            <DeleteServiceButton
              catalogId={catalogId}
              serviceId={serviceId}
              type='public-services'
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default PublicServiceDetailsPageClient;
