import { Dataset } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import {
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from '@catalog-frontend/utils';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getDatasets } from '../../../actions/actions';
import DatasetsPageClient from './datasets-page-client';

export default async function DatasetSearchHitsPage({ params }: Params) {
  const { catalogId } = params;

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const datasets: Dataset[] = await getDatasets(catalogId);
  const hasWritePermission = hasOrganizationWritePermission(session.accessToken, catalogId);

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/datasets`,
      text: localization.catalogType.dataset,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <DesignBanner
        catalogId={catalogId}
        title={localization.catalogType.dataset}
      />
      <DatasetsPageClient
        datasets={datasets}
        hasWritePermission={hasWritePermission}
        catalogId={catalogId}
      />
    </>
  );
}
