import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Service } from '@catalog-frontend/types';
import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getPublicServiceById } from '../../../../../actions/public-services/actions';
import { BasicServiceForm } from '../../../../../../components/basic-service-form';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './public-service-edit-page.module.css';
import { Heading } from '@digdir/design-system-react';

export default async function EditPublicServicePage({ params }: Params) {
  const { catalogId, serviceId } = params;
  const service: Service = await getPublicServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <div>
      <Breadcrumbs />
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
        <BasicServiceForm
          catalogId={catalogId}
          service={service}
          type='public-services'
        />
      </div>
    </div>
  );
}
