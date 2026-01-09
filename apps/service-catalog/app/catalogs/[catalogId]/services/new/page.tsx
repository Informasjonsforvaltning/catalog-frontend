import { Breadcrumbs, BreadcrumbType, PageBanner } from "@catalog-frontend/ui";
import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { NewPage } from "./new-page-client";

export default async function NewServicePage(props: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId } = await props.params;

  const [organization, statusesResponse] = await Promise.all([
    getOrganization(catalogId),
    getAdmsStatuses(),
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
        statuses={statusesResponse.statuses}
        referenceDataEnv={process.env.FDK_BASE_URI || ""}
      />
    </>
  );
}
