import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';
import { getServices } from '../../../actions/services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import ServicePageClient from './service-page-client';

export default async function ServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services: Service[] = await getServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getValidSession({ signInPath: '/auth/signin', callbackUrl: `/catalogs/${catalogId}/services` });
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <ServicePageClient
        services={services}
        hasWritePermission={hasWritePermission}
        statuses={statuses}
        catalogId={catalogId}
      />
    </>
  );
}
