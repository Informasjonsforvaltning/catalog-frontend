'use client';
import React, { useEffect, useState } from 'react';
import { Search } from '@digdir/design-system-react';
import Filter from '../../../../components/filter';
import { Service, ReferenceDataCode, FilterType } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import {
  Link,
  SearchHit,
  SearchHitContainer,
  SearchHitsPageLayout,
  ServiceStatusTagProps,
  Tag,
} from '@catalog-frontend/ui';
import styles from './public-service-page.module.css';
import { AddButton } from '../../../../components/buttons';
import FilterChips from '../../../../components/filter-chips';

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

  const filterServices = () => {
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
    const filteredServices = filterServices();
    setFilteredServices(filteredServices);
  }, [statusFilters, publicationFilters, searchQuery]);

  const removeFilter = (filterName: string, filterType: FilterType) => {
    switch (filterType) {
      case 'published':
        setPublicationFilters(publicationFilters?.filter((name) => name !== filterName) ?? []);
        break;
      case 'status':
        setStatusFilters(statusFilters?.filter((name) => name !== filterName) ?? []);
        break;
    }
  };

  const findServiceStatus = (service: Service) => statuses.find((s) => s.uri === service?.status);

  return (
    <SearchHitsPageLayout
      searchRow={
        <>
          <div>
            <Search
              error=''
              label={localization.search.search}
              placeholder={localization.search.searchForPublicService}
              size='small'
              variant='primary'
              onSearchClick={(value) => setSearchQuery(value)}
              className={styles.search}
            />
            <FilterChips
              statusFilters={statusFilters}
              publicationFilters={publicationFilters}
              handleRemoveFilter={(filter: string, filterType: FilterType) => removeFilter(filter, filterType)}
              statuses={statuses}
            />
          </div>
          {hasWritePermission && (
            <AddButton
              as={Link}
              href={`/catalogs/${catalogId}/public-services/new`}
            >
              {localization.serviceCatalog.form.newPublic}
            </AddButton>
          )}
        </>
      }
      leftColumn={
        <div>
          <Filter
            onStatusChange={setStatusFilters}
            onPublicationStateChange={setPublicationFilters}
            statuses={statuses}
            statusFilters={statusFilters}
            publicationState={publicationFilters}
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
                  statusTag={
                    service?.status && (
                      <Tag.ServiceStatus
                        statusKey={findServiceStatus(service)?.code as ServiceStatusTagProps['statusKey']}
                        statusLabel={getTranslateText(findServiceStatus(service)?.label) as string}
                      />
                    )
                  }
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
