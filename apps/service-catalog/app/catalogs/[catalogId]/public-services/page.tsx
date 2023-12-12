import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { PageBanner, SearchHit, SearchHitContainer } from '@catalog-frontend/ui';
import { authOptions, getTranslateText, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import { getPublicServices } from '../../../actions/public-services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './public-service-page.module.css';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Button, Heading } from '@digdir/design-system-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

export default async function PublicServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services: Service[] = await getPublicServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  return (
    <div className={styles.center}>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className={styles.container}>
        <div className={styles.headingContainer}>
          <Heading size='medium'>{localization.serviceCatalog.searchHitsTitle}</Heading>
          {hasWritePermission && (
            <Button
              as={Link}
              href={`/catalogs/${catalogId}/public-services/new`}
              className={styles.button}
            >
              {localization.serviceCatalog.form.new}
            </Button>
          )}
        </div>

        <SearchHitContainer
          searchHits={
            services &&
            services.map((service: Service) => (
              <div
                className={styles.searchHitCard}
                key={service.id}
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
          noSearchHits={services?.length < 1 ?? true}
        />
      </div>
    </div>
  );
}
