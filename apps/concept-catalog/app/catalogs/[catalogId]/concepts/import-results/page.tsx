import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { ImportResult } from '@catalog-frontend/types';
import { getConceptImportResults } from '@catalog-frontend/data-access';
import { withAdminProtectedPage } from '@concept-catalog/utils/auth';
import ImportResultsPageClient from './import-results-page-client';

const ImportResultsPage = withAdminProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/import-results`,
  async ({ catalogId, session }) => {
    const importResults: ImportResult[] = await getConceptImportResults(catalogId, `${session.accessToken}`)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/concepts`,
        text: localization.catalogType.concept,
      },
      {
        href: `/catalogs/${catalogId}/concepts/import-results`,
        text: 'Importeringsresultat',
      },
    ] as BreadcrumbType[];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <ImportResultsPageClient
          catalogId={catalogId}
          importResults={importResults}
        />
      </>
    );
  },
);

export default ImportResultsPage;
