import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Organization, Service } from "@catalog-frontend/types";
import { Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { EditPage } from "./edit-page-client";
import { getPublicServiceById } from "@service-catalog/app/actions/public-services/actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;
  const service: Service = await getPublicServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then(
    (res) => res.json(),
  );
  const statusesResponse = await getAdmsStatuses();

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
        subtitle={getTranslateText(organization?.prefLabel)}
      />
      <EditPage service={service} statuses={statusesResponse.statuses} />
    </>
  );
}
