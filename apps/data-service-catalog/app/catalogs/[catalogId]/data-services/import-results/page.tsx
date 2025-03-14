import { BreadcrumbType, Breadcrumbs, DesignBanner, ImportResults } from '@catalog-frontend/ui';
import { getValidSession, localization } from '@catalog-frontend/utils';
import { ImportResult } from '@catalog-frontend/types';
import { getDataServiceImportResults } from '@catalog-frontend/data-access';

export default async function ImportResultsPage({ params }) {
  const { catalogId } = params;
  const session = await getValidSession();
  const importResults: ImportResult[] = await getDataServiceImportResults(catalogId, `${session.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/import-results`,
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
        title={localization.catalogType.dataService}
        catalogId={catalogId}
      />
      <ImportResults
        importHref={`/catalogs/${catalogId}/data-services/import-results`}
        importResults={importResults}
      />
    </>
  );
}
