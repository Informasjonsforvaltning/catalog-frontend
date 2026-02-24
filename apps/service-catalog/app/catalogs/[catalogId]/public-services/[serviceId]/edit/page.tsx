import {
  getAdmsStatuses,
  getMainActivities,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Breadcrumbs, PageBanner } from "@catalog-frontend/ui-v2";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { EditPage } from "./edit-page-client";
import { getPublicServiceById } from "@service-catalog/app/actions/public-services/actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;
  const [service, organization, statusesResponse, mainActivities] =
    await Promise.all([
      getPublicServiceById(catalogId, serviceId),
      getOrganization(catalogId),
      getAdmsStatuses(),
      getMainActivities(),
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
        title={localization.catalogType.publicService}
        subtitle={getTranslateText(organization?.prefLabel)}
      />
      <EditPage
        mainActivities={mainActivities.mainActivities}
        referenceDataEnv={process.env.FDK_BASE_URI || ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI || ""}
        service={service}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
