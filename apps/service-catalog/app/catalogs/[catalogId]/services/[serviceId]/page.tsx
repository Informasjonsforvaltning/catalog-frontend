import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import {
  Organization,
  ReferenceDataCode,
  Service,
} from "@catalog-frontend/types";
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

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;

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
  const organization: Organization = await getOrganization(catalogId).then(
    (res) => res.json(),
  );
  const hasWritePermission =
    session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const statusesResponse = await getAdmsStatuses();
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
    {
      href: `/catalogs/${catalogId}/services/${serviceId}`,
      text: getTranslateText(service.title),
    },
  ] as BreadcrumbType[];

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
        service={service}
        catalogId={catalogId}
        serviceId={serviceId}
        hasWritePermission={hasWritePermission}
        statuses={statuses}
      />
    </>
  );
}
