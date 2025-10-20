import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, Service } from '@catalog-frontend/types';
import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getServiceById } from '../../../../../actions/services/actions';
import { EditPage } from './edit-page-client';

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;
  const service: Service = await getServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
    {
      href: `/catalogs/${catalogId}/services/${serviceId}`,
      text: getTranslateText(service.title).toString(),
    },
    {
      href: `/catalogs/${catalogId}/services/${serviceId}/edit`,
      text: localization.serviceCatalog.editService,
    },
  ];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <EditPage
        service={service}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
