import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { PageBanner } from '@catalog-frontend/ui';
import { authOptions, getTranslateText, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import { getPublicServices } from '../../../actions/public-services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import PublicServicePageClient from './public-service-page-client';

export default async function PublicServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services: Service[] = await getPublicServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
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
