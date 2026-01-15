import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { EditPage } from "./edit-page-client";
import { getPublicServiceById } from "@service-catalog/app/actions/public-services/actions";

export default async function EditServicePage(
  props: PageProps<"/catalogs/[catalogId]/public-services/[serviceId]/edit">,
) {
  const { catalogId, serviceId } = await props.params;
  const [service, organization, statusesResponse] = await Promise.all([
    getPublicServiceById(catalogId, serviceId),
    getOrganization(catalogId),
    getAdmsStatuses(),
  ]);

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
      <EditPage
        referenceDataEnv={process.env.FDK_BASE_URI || ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI || ""}
        service={service}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
