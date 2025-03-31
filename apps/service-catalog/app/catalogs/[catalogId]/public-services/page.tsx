import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getValidSession,
  getTranslateText,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from '@catalog-frontend/utils';
import { getPublicServices } from '../../../actions/public-services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import PublicServicePageClient from './public-service-page-client';

export default async function PublicServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const session = await getValidSession();
  if(!session) {
    return redirectToSignIn({
      callbackUrl: `/catalogs/${catalogId}/public-services`,
    });
  }

  const services: Service[] = await getPublicServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}/>
      <PageBanner
        title={localization.catalogType.publicService}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <PublicServicePageClient
        services={services}
        hasWritePermission={hasWritePermission}
        statuses={statuses}
        catalogId={catalogId}
      />
    </>
  );
}
