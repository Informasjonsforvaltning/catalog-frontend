import { Dataset, Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import ServicePageClient from './datasets-page-client';
import { getDatasets } from 'apps/dataset-catalog/app/actions/actions';
import DatasetsPageClient from './datasets-page-client';

export default async function ServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/services` });

  const datasets: Dataset[] = await getDatasets(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const hasWritePermission = await hasOrganizationWritePermission(session.accessToken, catalogId);

  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/datasets`,
      text: localization.catalogType.dataset,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <DatasetsPageClient
        datasets={datasets}
        hasWritePermission={hasWritePermission}
        statuses={statuses}
        catalogId={catalogId}
      />
    </>
  );
}
