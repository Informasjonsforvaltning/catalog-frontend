import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from '@catalog-frontend/utils';
import { getPublicServiceById } from '../../../../actions/public-services/actions';
import { RedirectType, redirect } from 'next/navigation';
import PublicServiceDetailsPageClient from './public-service-details-page-client';

export default async function PublicServiceDetailsPage({
  params,
}: {
  params: Promise<{ catalogId: string; serviceId: string }>;
}) {
  const { catalogId, serviceId } = await params;

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn({
      callbackUrl: `/catalogs/${catalogId}/public-services/${serviceId}`,
    });
  }

  const service: Service | null = await getPublicServiceById(catalogId, serviceId);
  if (!service) {
    redirect(`/notfound`, RedirectType.replace);
  }
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/public-services/${serviceId}`,
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
        title={localization.catalogType.publicService}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <PublicServiceDetailsPageClient
        service={service}
        catalogId={catalogId}
        serviceId={serviceId}
        hasWritePermission={hasWritePermission}
        statuses={statuses}
      />
    </>
  );
}
