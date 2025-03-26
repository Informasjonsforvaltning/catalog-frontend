'use client';

import { NavigationCard, Spinner } from '@catalog-frontend/ui';
import {
  getConceptCount,
  getDataServiceCount,
  getDatasetCount,
  getRecordsOfProcessingActivityCount,
  getServiceCount,
} from '../../../../actions';
import { localization } from '@catalog-frontend/utils';
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { Alert } from '@digdir/designsystemet-react';
import styles from '../../catalogs.module.css';

type CatalogCardProps = {
  variant: 'dataset' | 'data-service' | 'concept' | 'service' | 'public-service' | 'records-of-processing';
  organizationId: string;
  href: string;
};

const CardSpinner = () => {
  return (
    <div className={styles.cardSpinner}>
      <Spinner
        title='Laster...'
        size='small'
      />
    </div>
  );
};

const ShutDownAlert = () => (
  <Alert
    severity='warning'
    size='small'
    className={styles.warning}
  >
    Legges ned 31. mai 2025
  </Alert>
);

export const CatalogCard = ({ variant, organizationId, href }: CatalogCardProps) => {
  const [body, setBody] = useState<ReactElement<any, string | JSXElementConstructor<any>>>(
    variant === 'records-of-processing' ? (
      <>
        <CardSpinner />
        <ShutDownAlert />
      </>
    ) : (
      <CardSpinner />
    ),
  );
  let title, subtitle;

  if (variant === 'dataset') {
    title = localization.catalogType.dataset;
  } else if (variant === 'data-service') {
    title = localization.catalogType.dataService;
  } else if (variant === 'concept') {
    title = localization.catalogType.concept;
  } else if (variant === 'service') {
    title = localization.catalogType.service;
    subtitle = localization.resourceType.services;
  } else if (variant === 'public-service') {
    title = localization.catalogType.service;
    subtitle = localization.resourceType.publicServices;
  } else if (variant === 'records-of-processing') {
    title = localization.catalogType.recordsOfProcessingActivities;
  }

  useEffect(() => {
    async function fetchCount() {
      if (variant === 'dataset') {
        const datasetCount = await getDatasetCount(organizationId);
        setBody(
          <>{`${datasetCount > 0 ? datasetCount : localization.none} ${localization.descriptionType.dataset}`}</>,
        );
      } else if (variant === 'data-service') {
        const dataServiceCount = await getDataServiceCount(organizationId);
        setBody(
          <>{`${dataServiceCount > 0 ? dataServiceCount : localization.none} ${localization.descriptionType.dataService}`}</>,
        );
      } else if (variant === 'concept') {
        const conceptCount = await getConceptCount(organizationId);
        setBody(
          <>{`${conceptCount > 0 ? conceptCount : localization.none} ${localization.descriptionType.concept}`}</>,
        );
      } else if (variant === 'service' || variant === 'public-service') {
        const serviceCount =
          variant === 'service'
            ? (await getServiceCount(organizationId)).serviceCount
            : (await getServiceCount(organizationId)).publicServiceCount;
        setBody(
          <>{`${serviceCount > 0 ? serviceCount : localization.none} ${localization.descriptionType.service}`}</>,
        );
      } else if (variant === 'records-of-processing') {
        const processingActivitiesCount = await getRecordsOfProcessingActivityCount(organizationId);
        setBody(
          <>
            <span className={styles.behandlingsoversikt}>
              {`${processingActivitiesCount > 0 ? processingActivitiesCount : localization.none} ${localization.descriptionType.recordsOfProcessingActivities}`}
            </span>
            <ShutDownAlert />
          </>,
        );
      }
    }

    fetchCount();
  }, []);

  return (
    <NavigationCard
      title={title}
      subtitle={subtitle}
      body={body}
      href={href}
    />
  );
};
