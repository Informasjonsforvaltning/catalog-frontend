import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getPublicServiceById } from '../../../../../actions/public-services/actions';
import { BasicServiceForm } from '../../../../../../components/basic-service-form';
import styles from './public-service-edit-page.module.css';
import { Heading } from '@digdir/designsystemet-react';

export default async function EditPublicServicePage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;
  const service: Service = await getPublicServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/public-services/${serviceId}`,
      text: getTranslateText(service.title),
    },
    {
      href: `/catalogs/${catalogId}/public-services/${serviceId}/edit`,
      text: localization.serviceCatalog.editPublicService,
    },
  ] as BreadcrumbType[];

  return (
    <div>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.publicService}
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
          statuses={statuses}
        />
      </div>
    </div>
  );
}
