import { Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import { Organization } from "@catalog-frontend/types";
import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { NewPage } from "./new-page-client";

export default async function NewPublicServicePage(
  props: PageProps<"/catalogs/[catalogId]/public-services/new">,
) {
  const { catalogId } = await props.params;
  const organization: Organization = await getOrganization(catalogId);
  const statusesResponse = await getAdmsStatuses();

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/public-services/new`,
      text: localization.serviceCatalog.form.newPublic,
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
      <NewPage
        referenceDataEnv={process.env.FDK_BASE_URI || ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI || ""}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
