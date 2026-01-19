import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { Service } from "@catalog-frontend/types";
import { BreadcrumbType, Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from "@catalog-frontend/utils";
import { getServiceById } from "../../../../actions/services/actions";
import { RedirectType, redirect } from "next/navigation";
import ServiceDetailsPageClient from "./service-details-page-client";

export default async function ServiceDetailsPage(
  props: PageProps<"/catalogs/[catalogId]/services/[serviceId]">,
) {
  const { catalogId, serviceId } = await props.params;

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn({
      callbackUrl: `/catalogs/${catalogId}/services/${serviceId}`,
    });
  }
  const service: Service | null = await getServiceById(catalogId, serviceId);
  if (!service) {
    return redirect(`/notfound`, RedirectType.replace);
  }
  const hasWritePermission =
    session && hasOrganizationWritePermission(session?.accessToken, catalogId);

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
      href: `/catalogs/${catalogId}/services/${serviceId}`,
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
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel)}
      />
      <ServiceDetailsPageClient
        catalogId={catalogId}
        hasWritePermission={hasWritePermission}
        referenceDataEnv={process.env.FDK_BASE_URI ?? ""}
        searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI ?? ""}
        service={service}
        serviceId={serviceId}
        statuses={statusesResponse.statuses}
      />
    </>
  );
}
