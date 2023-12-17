'use client';
import React, { useEffect, useState } from 'react';
import { Heading, Search } from '@digdir/design-system-react';
import Link from 'next/link';
import Filter from '../../../../components/filter';
import { Service, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { SearchHit, SearchHitContainer, SearchHitsPageLayout } from '@catalog-frontend/ui';
import styles from './public-service-page.module.css';
import _ from 'lodash';
import { AddButton } from 'apps/service-catalog/components/buttons';

interface Props {
  services: Service[];
  hasWritePermission: boolean;
  catalogId: string;
  statuses: ReferenceDataCode[];
}

const PublicServicePageClient = ({ services, hasWritePermission, catalogId, statuses }: Props) => {
  const [filteredServices, setFilteredServices] = useState(services);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [publicationFilters, setPublicationFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterServices = (statusFilters: string[], publicationFilters: string[], searchQuery: string) => {
    let filtered = services;

    if (statusFilters.length > 0) {
      filtered = filtered.filter((service) => service.status && statusFilters.includes(service.status));
    }

    if (publicationFilters.length > 0) {
      filtered = filtered.filter((service) => publicationFilters.includes(String(service.published)));
    }

    if (searchQuery.trim() !== '') {
      const searchResult = services.filter((service) =>
        String(getTranslateText(service.title)).toLowerCase().includes(searchQuery.toLowerCase()),
      );
      filtered = filtered.filter((service) => searchResult.includes(service));
    }

    return filtered;
  };

  useEffect(() => {
    const combinedFilteredServices = filterServices(statusFilters, publicationFilters, searchQuery);
    setFilteredServices(combinedFilteredServices);
  }, [services, statusFilters, publicationFilters, searchQuery]);

  const handleStatusFilterChange = (filters: string[]) => {
    setStatusFilters(filters);
  };

  const handlePublicationStateChange = (filters: string[]) => {
    setPublicationFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchHitsPageLayout
      buttonRow={
        hasWritePermission && (
          <AddButton
            as={Link}
            href={`/catalogs/${catalogId}/public-services/new`}
          >
            {localization.serviceCatalog.form.newPublic}
          </AddButton>
        )
      }
      searchRow={<Heading size='medium'>{localization.serviceCatalog.searchHitsTitle}</Heading>}
      leftColumn={
        <div>
          <Search
            className={styles.search}
            error=''
            label={localization.search.search}
            placeholder={localization.search.searchForPublicService}
            size='medium'
            variant='simple'
            onKeyUp={(event) => handleSearch(event.target.value)}
          />
          <Filter
            onStatusChange={handleStatusFilterChange}
            onPublicationStateChange={handlePublicationStateChange}
            statuses={statuses}
          />
        </div>
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
                  titleHref={`/catalogs/${catalogId}/public-services/${service?.id}`}
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

export default PublicServicePageClient;
