import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getPublicServiceById } from '../../../../actions/public-services/actions';
import _ from 'lodash';
import { RedirectType, redirect } from 'next/navigation';
import PublicServiceDetailsPageClient from './public-service-details-page-client';

export default async function PublicServiceDetailsPage({ params }: Params) {
  const { catalogId, serviceId } = params;

  const service: Service | null = await getPublicServiceById(catalogId, serviceId);
  if (!service) {
    redirect(`/notfound`, RedirectType.replace);
  }
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getValidSession({
    signInPath: '/auth/signin',
    callbackUrl: `/catalogs/${catalogId}/public-services/${serviceId}`,
  });
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
      <Breadcrumbs breadcrumbList={breadcrumbList} />
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
