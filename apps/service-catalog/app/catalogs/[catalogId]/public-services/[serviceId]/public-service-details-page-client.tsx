'use client';
import { ReferenceDataCode, Service } from '@catalog-frontend/types';
import { DetailsPageLayout, InfoCard, Tag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';

import _ from 'lodash';

import Link from 'next/link';
import { DeleteServiceButton } from '../../../../../components/buttons';
import PublishSwitch from '../../../../../components/publish-switch';
import BasicServiceFormInfoCardItems from '../../../../../components/basic-form-info-card-items';
import { useState } from 'react';
import styles from './public-service-details-page.module.css';
import { Button } from '@digdir/design-system-react';

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
      headingTitle={
        <div className={styles.status}>
          <h2>{getTranslateText(service?.title ?? '', language)}</h2>
          {service.status !== 'Ingen status' && (
            <Tag>{getTranslateText(statuses.find((s) => s.uri === service?.status)?.label) as string}</Tag>
          )}
        </div>
      }
      loading={false}
      mainColumn={
        <InfoCard>
          {!_.isEmpty(getTranslateText(service?.description ?? '', language)) && (
            <BasicServiceFormInfoCardItems
              service={service}
              language={language}
            />
          )}
        </InfoCard>
      }
      rightColumn={<RightColumn />}
      buttons={
        hasWritePermission && (
          <div className={styles.actionButtons}>
            <Button
              size='small'
              as={Link}
              href={`/catalogs/${catalogId}/public-services/${serviceId}/edit`}
            >
              Rediger
            </Button>

            <DeleteServiceButton
              catalogId={catalogId}
              serviceId={serviceId}
              type='public-services'
            />
          </div>
        )
      }
    />
  );
};

export default PublicServiceDetailsPageClient;
