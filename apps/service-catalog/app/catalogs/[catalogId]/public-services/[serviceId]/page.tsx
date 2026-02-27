import {
  getAdmsStatuses,
  getMainActivities,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Service } from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  PageBanner,
} from "@catalog-frontend/ui-v2";
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from "@catalog-frontend/utils";
import { getPublicServiceById } from "../../../../actions/public-services/actions";
import { RedirectType, redirect } from "next/navigation";
import PublicServiceDetailsPageClient from "./public-service-details-page-client";

export default async function PublicServiceDetailsPage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn(
      `/catalogs/${catalogId}/public-services/${serviceId}`,
    );
  }

  const service: Service | null = await getPublicServiceById(
    catalogId,
    serviceId,
  );
  if (!service) {
    redirect("/notfound", RedirectType.replace);
  }
  const hasWritePermission = hasOrganizationWritePermission(
    session.accessToken,
    catalogId,
  );
  const [organization, statusesResponse, mainActivities] = await Promise.all([
    getOrganization(catalogId),
    getAdmsStatuses(),
    getMainActivities(),
  ]);

  const breadcrumbList: BreadcrumbType[] = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/public-services/${serviceId}`,
      text: getTranslateText(service.title),
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
      <PublicServiceDetailsPageClient
        catalogId={catalogId}
        hasWritePermission={hasWritePermission}
        mainActivities={mainActivities.mainActivities}
        referenceDataEnv={process.env.FDK_BASE_URI ?? ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI ?? ""}
        service={service}
        serviceId={serviceId}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
