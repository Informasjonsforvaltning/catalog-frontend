import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import ServiceForm from '../../../../../components/service-form';
import { Heading } from '@digdir/design-system-react';
import { PageBanner } from '@catalog-frontend/ui';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import styles from './public-service-new-page.module.css';

export default async function NewPublicServicePage({ params }: Params) {
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <div className='container'>
        <Heading
          size='medium'
          className={styles.heading}
        >
          {localization.serviceCatalog.infoAboutService}
        </Heading>
        <ServiceForm catalogId={catalogId} />
      </div>
    </>
  );
}
