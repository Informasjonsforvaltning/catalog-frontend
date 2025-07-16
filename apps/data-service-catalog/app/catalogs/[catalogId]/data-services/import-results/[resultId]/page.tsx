import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { localization, validUUID } from '@catalog-frontend/utils';
import { getDataServiceImportResultById } from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import ImportResultDetailsPageClient from './import-result-details-page-client';
import { withAdminProtectedPage } from '@data-service-catalog/utils/auth';

const ImportResultDetailsPage = withAdminProtectedPage(
  ({ catalogId, resultId }) => `/catalogs/${catalogId}/data-services/import-results/${resultId}`,
  async ({ catalogId, resultId, session }) => {
    if (!resultId || !validUUID(resultId)) {
      return redirect(`/notfound`, RedirectType.replace);
    }
    const importResult = await getDataServiceImportResultById(catalogId, resultId, `${session?.accessToken}`).then(
      (response) => {
        if (response.ok) return response.json();
      },
    );
    if (!importResult || importResult.catalogId !== catalogId) {
      redirect(`/not-found`, RedirectType.replace);
    }

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
        text: `Import #${importResult.id.slice(0, 5).toUpperCase()}`,
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
  },
);

export default ImportResultDetailsPage;
