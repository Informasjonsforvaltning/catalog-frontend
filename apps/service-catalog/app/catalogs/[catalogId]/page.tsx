import { Card, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import styles from './services-page.module.css';
import cn from 'classnames';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function CatalogPage({ params }: Params) {
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className={cn(styles.cardsContainer, 'container')}>
        <Card
          title={localization.publicServices}
          href={`/catalogs/${catalogId}/public-services`}
        />
        <Card
          title={localization.services}
          href={`/catalogs/${catalogId}/services`}
        />
      </div>
    </>
  );
}
