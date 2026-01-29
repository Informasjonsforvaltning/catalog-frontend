import { Breadcrumbs, BreadcrumbType, PageBanner } from "@catalog-frontend/ui";
import {
  getAdmsStatuses,
  getMainActivities,
  getOrganization,
} from "@catalog-frontend/data-access";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { NewPage } from "./new-page-client";

export default async function NewServicePage(props: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId } = await props.params;

  const [organization, statusesResponse, mainActivitiesResponse] =
    await Promise.all([
      getOrganization(catalogId),
      getAdmsStatuses(),
      getMainActivities(),
    ]);

  const breadcrumbList: BreadcrumbType[] = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
    {
      href: `/catalogs/${catalogId}/services/new`,
      text: localization.serviceCatalog.form.new,
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
      <NewPage
        mainActivities={mainActivitiesResponse.mainActivities}
        referenceDataEnv={process.env.FDK_BASE_URI || ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI || ""}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
