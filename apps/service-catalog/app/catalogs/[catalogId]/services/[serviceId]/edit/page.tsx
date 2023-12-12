import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getServiceById } from '../../../../../actions/services/actions';
import { BasicServiceForm } from '../../../../../../components/basic-service-form';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './service-edit-page.module.css';
import { Heading } from '@digdir/design-system-react';

export default async function EditServicePage({ params }: Params) {
  const { catalogId, serviceId } = params;
  const service: Service = await getServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

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
          type='services'
          statuses={statuses}
        />
      </div>
    </div>
  );
}
