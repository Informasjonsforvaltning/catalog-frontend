import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import { getValidSession, hasOrganizationAdminPermission, localization } from '@catalog-frontend/utils';
import ImportResultsPageClient from './import-results-page-client';
import { ImportResult } from "@catalog-frontend/types";
import {getDataServiceImportResults} from "@catalog-frontend/data-access";

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

  const hasAdminPermission = await hasOrganizationAdminPermission(session.accessToken, catalogId);

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/imports`,
      text: 'Import',
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
      <ImportResultsPageClient
        catalogId={catalogId}
        hasAdminPermission={hasAdminPermission}
        importResults={importResults}
      />
    </>
  );
}
