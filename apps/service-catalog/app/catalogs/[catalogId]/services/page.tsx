import { Organization, Service } from '@catalog-frontend/types';
import { PageBanner, SearchHit, SearchHitContainer } from '@catalog-frontend/ui';
import { authOptions, getTranslateText, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './service-page.module.css';
import { getOrganization } from '@catalog-frontend/data-access';
import { Button, Heading } from '@digdir/design-system-react';
import Link from 'next/link';
import { getServices } from '../../../../app/actions/services/actions';
import { getServerSession } from 'next-auth';

export default async function ServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services: Service[] = await getServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

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
              href={`/catalogs/${catalogId}/services/new`}
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
                  titleHref={`/catalogs/${catalogId}/services/${service?.id}`}
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
