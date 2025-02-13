import { DataService, Organization } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';

import { getDistributionStatuses, getOrganization } from '@catalog-frontend/data-access';
import DataServicePageClient from './data-services-page-client';
import { getDataServices } from '../../../actions/actions';

export default async function DataServicesSearchHits({ params }) {
  const { catalogId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/data-services` });

  const dataServices: DataService[] = await getDataServices(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

  const distributionStatuses = await getDistributionStatuses()
    .then((response) => response.json())
    .then((body) => body?.distributionStatuses ?? []);

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.dataService}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <DataServicePageClient
        dataServices={dataServices}
        catalogId={catalogId}
        hasWritePermission={hasWritePermission}
        distributionStatuses={distributionStatuses}
      />
    </>
  );
}
