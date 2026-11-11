import { Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import {
  getAdmsStatuses,
  getCurrencies,
  getEvidenceTypes,
  getLosThemes,
  getMainActivities,
  getOrganization,
} from "@catalog-frontend/data-access";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { NewPage } from "./new-page-client";

export default async function NewPublicServicePage({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) {
  const { catalogId } = await params;
  const [
    organization,
    statusesResponse,
    mainActivitiesResponse,
    losThemesResponse,
    currenciesResponse,
    evidenceTypesResponse,
  ] = await Promise.all([
    getOrganization(catalogId),
    getAdmsStatuses(),
    getMainActivities(),
    getLosThemes(),
    getCurrencies(),
    getEvidenceTypes(),
  ]);

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
        currencies={currenciesResponse.currencies}
        evidenceTypes={evidenceTypesResponse.evidenceTypes}
        losThemes={losThemesResponse.losNodes}
        mainActivities={mainActivitiesResponse.mainActivities}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI || ""}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
