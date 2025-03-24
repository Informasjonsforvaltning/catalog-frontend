import { DataService } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import { getValidSession, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';

import { getDistributionStatuses } from '@catalog-frontend/data-access';
import DataServicePageClient from './data-services-page-client';
import { getDataServices } from '../../../actions/actions';

export default async function DataServicesSearchHits(props) {
  const params = await props.params;
  const { catalogId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/data-services` });

  const dataServices: DataService[] = await getDataServices(catalogId);
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
      <DesignBanner
        title={localization.catalogType.dataService}
        catalogId={catalogId}
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
