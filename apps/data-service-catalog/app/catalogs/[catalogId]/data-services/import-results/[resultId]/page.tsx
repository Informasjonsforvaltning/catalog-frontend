import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { capitalizeFirstLetter, formatISO, getValidSession, localization } from '@catalog-frontend/utils';
import { getDataServiceImportResultById } from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import ImportResultDetailsPageClient from './import-result-details-page-client';

export default async function ImportResultDetailsPage({ params }: Params) {
  const { catalogId, resultId } = params;
  const session = await getValidSession();
  const importResult = await getDataServiceImportResultById(catalogId, resultId, `${session?.accessToken}`).then(
    (response) => {
      if (response.ok) return response.json();
    },
  );
  if (!importResult || importResult.catalogId !== catalogId) {
    redirect(`/not-found`, RedirectType.replace);
  }

  const breadcrumbTitle = `${capitalizeFirstLetter(
    formatISO(importResult.created, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  )}`;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/import-results`,
      text: 'Importeringsresultat',
    },
    {
      href: `/catalogs/${catalogId}/data-services/import-results/${resultId}`,
      text: breadcrumbTitle,
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
      <ImportResultDetailsPageClient
        catalogId={catalogId}
        importResult={importResult}
      />
    </>
  );
}
