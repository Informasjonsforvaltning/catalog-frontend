import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Breadcrumbs, BreadcrumbType, PageBanner } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { getServiceById } from "../../../../../actions/services/actions";
import { EditPage } from "./edit-page-client";

export default async function EditServicePage(
  props: PageProps<"/catalogs/[catalogId]/services/[serviceId]/edit">,
) {
  const { catalogId, serviceId } = await props.params;
  const [service, organization, statusesResponse] = await Promise.all([
    getServiceById(catalogId, serviceId),
    getOrganization(catalogId),
    getAdmsStatuses(),
  ]);

  const breadcrumbList: BreadcrumbType[] = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
    {
      href: `/catalogs/${catalogId}/services/${serviceId}`,
      text: getTranslateText(service.title),
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
