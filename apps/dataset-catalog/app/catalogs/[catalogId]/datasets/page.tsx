import { Dataset, Organization } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getOrganization } from '@catalog-frontend/data-access';
import { getDatasets } from '../../../actions/actions';
import DatasetsPageClient from './datasets-page-client';

export default async function DatasetSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/datasets` });

  const datasets: Dataset[] = await getDatasets(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const hasWritePermission = hasOrganizationWritePermission(session.accessToken, catalogId);

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
        catalogId={catalogId}
      />
    </>
  );
}
