'use client';

import { NavigationCard, Spinner } from '@catalog-frontend/ui';
import {
  getConceptCount,
  getDataServiceCount,
  getDatasetCount,
  getServiceCount,
} from '../../../../actions';
import { localization } from '@catalog-frontend/utils';
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import styles from '../../catalogs.module.css';

type CatalogCardProps = {
  variant: 'dataset' | 'data-service' | 'concept' | 'service' | 'public-service';
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

export const CatalogCard = ({ variant, organizationId, href }: CatalogCardProps) => {
  const [body, setBody] = useState<ReactElement<any, string | JSXElementConstructor<any>>>(
    <CardSpinner />
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
