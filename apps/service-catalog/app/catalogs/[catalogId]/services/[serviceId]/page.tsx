import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { authOptions, getTranslateText, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getServiceById } from '../../../../actions/services/actions';
import _ from 'lodash';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';
import ServiceDetailsPageClient from './service-details-page-client';

export default async function PublicServiceDetailsPage({ params }: Params) {
  const { catalogId, serviceId } = params;

  const service: Service | null = await getServiceById(catalogId, serviceId);
  if (!service) {
    redirect(`/not-found`, RedirectType.replace);
  }
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/services/${serviceId}`,
      text: getTranslateText(service.title),
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
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
