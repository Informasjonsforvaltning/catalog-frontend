'use client';
import React, { useEffect, useState } from 'react';
import { Search } from '@digdir/designsystemet-react';
import Filter from '../../../../components/filter';
import { Service, ReferenceDataCode, FilterType } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import {
  LinkButton,
  SearchField,
  SearchHit,
  SearchHitContainer,
  SearchHitsLayout,
  ServiceStatusTagProps,
  Tag,
} from '@catalog-frontend/ui';
import styles from './public-service-page.module.css';
import FilterChips from '../../../../components/filter-chips';
import { PlusCircleIcon } from '@navikt/aksel-icons';

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
    <SearchHitsLayout>
      <SearchHitsLayout.SearchRow>
        <div className={styles.search}>
          <SearchField
            className={styles.searchField}
            placeholder={localization.search.searchForPublicService}
            onSearch={(value) => setSearchQuery(value)}

          />
          {hasWritePermission && (
            <LinkButton href={`/catalogs/${catalogId}/public-services/new`}>
              <PlusCircleIcon />
              {localization.serviceCatalog.form.newPublic}
            </LinkButton>
          )}
        </div>
        {(statusFilters.length > 0 || publicationFilters.length > 0) ? (
          <FilterChips
            statusFilters={statusFilters}
            publicationFilters={publicationFilters}
            handleRemoveFilter={(filter: string, filterType: FilterType) => removeFilter(filter, filterType)}
            statuses={statuses}
          />
        ) : undefined}
      </SearchHitsLayout.SearchRow>
      <SearchHitsLayout.LeftColumn>
        <div>
          <Filter
            onStatusChange={setStatusFilters}
            onPublicationStateChange={setPublicationFilters}
            statuses={statuses}
            statusFilters={statusFilters}
            publicationState={publicationFilters}
          />
        </div>
      </SearchHitsLayout.LeftColumn>
      <SearchHitsLayout.MainColumn>
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
          noSearchHits={!(filteredServices?.length)}
        />
      </SearchHitsLayout.MainColumn>
    </SearchHitsLayout>
  );
};

export default PublicServicePageClient;
