import { Dataset } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs } from '@catalog-frontend/ui';
import { getValidSession, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import Banner from '../../../../components/banner';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getDatasets } from '../../../actions/actions';
import DatasetsPageClient from './datasets-page-client';

export default async function DatasetSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/datasets` });

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
      <Banner catalogId={catalogId} />
      <DatasetsPageClient
        datasets={datasets}
        hasWritePermission={hasWritePermission}
        catalogId={catalogId}
      />
    </>
  );
}
