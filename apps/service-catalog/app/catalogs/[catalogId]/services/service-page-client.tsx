'use client';
import React, { useEffect, useState } from 'react';
import { Button, Heading } from '@digdir/design-system-react';
import Link from 'next/link';
import Filter from '../../../../components/filter';
import { Service, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { SearchHit, SearchHitContainer, SearchHitsPageLayout } from '@catalog-frontend/ui';
import styles from './service-page.module.css';
import _ from 'lodash';

interface Props {
  services: Service[];
  hasWritePermission: boolean;
  catalogId: string;
  statuses: ReferenceDataCode[];
}

const ServicePageClient = ({ services, hasWritePermission, catalogId, statuses }: Props) => {
  const [filteredServices, setFilteredServices] = useState(services);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [publicationFilters, setPublicationFilters] = useState<string[]>([]);

  const filterServices = (statusFilters: string[], publicationFilters: string[]) => {
    if (statusFilters.length === 0 && publicationFilters.length === 0) {
      return services; // Return all services if both filters are empty
    }

    return services.filter(
      (service) =>
        (statusFilters.length === 0 || (service.status && statusFilters.includes(service.status))) &&
        (publicationFilters.length === 0 || publicationFilters.includes(String(service.published))),
    );
  };

  useEffect(() => {
    const combinedFilteredServices = filterServices(statusFilters, publicationFilters);
    setFilteredServices(combinedFilteredServices);
  }, [services, statusFilters, publicationFilters]);

  const handleStatusFilterChange = (filters: string[]) => {
    setStatusFilters(filters);
  };

  const handlePublicationStateChange = (filters: string[]) => {
    setPublicationFilters(filters);
  };

  return (
    <SearchHitsPageLayout
      buttonRow={
        hasWritePermission && (
          <Button
            as={Link}
            href={`/catalogs/${catalogId}/services/new`}
          >
            {localization.serviceCatalog.form.new}
          </Button>
        )
      }
      searchRow={<Heading size='medium'>{localization.serviceCatalog.searchHitsTitle}</Heading>}
      leftColumn={
        <Filter
          onStatusChange={handleStatusFilterChange}
          onPublicationStateChange={handlePublicationStateChange}
          statuses={statuses}
        />
      }
      mainColumn={
        <SearchHitContainer
          searchHits={
            filteredServices &&
            filteredServices.map((service: Service) => (
              <div
                key={service.id}
                className={styles.searchHit}
              >
                <SearchHit
                  title={getTranslateText(service?.title)}
                  description={getTranslateText(service?.description)}
                  titleHref={`/catalogs/${catalogId}/services/${service?.id}`}
                  status={getTranslateText(statuses.find((s) => s.uri === service?.status)?.label) as string}
                  content={
                    service.published
                      ? localization.publicationState.publishedInFDK
                      : localization.publicationState.unpublished
                  }
                />
              </div>
            ))
          }
          noSearchHits={filteredServices?.length < 1 ?? true}
        />
      }
    />
  );
};

export default ServicePageClient;
