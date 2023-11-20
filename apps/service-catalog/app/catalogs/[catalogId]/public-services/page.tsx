import { Organization, Service } from '@catalog-frontend/types';
import { PageBanner, SearchHit, SearchHitContainer } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getPublicServices } from '../../../actions/public-services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './public-service-page.module.css';
import { getOrganization } from '@catalog-frontend/data-access';

export default async function PublicServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services: Service[] = await getPublicServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <div className={styles.center}>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className={styles.container}>
        <SearchHitContainer
          searchHits={
            services &&
            services.map((service: Service) => (
              <div
                className={styles.searchHitCard}
                key={service.id}
              >
                <SearchHit
                  title={getTranslateText(service.title)}
                  description={getTranslateText(service.description)}
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
