import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { ImportResult } from "@catalog-frontend/types";
import { getDataServiceImportResults } from "@catalog-frontend/data-access";
import { withAdminProtectedPage } from "@data-service-catalog/utils/auth";
import ImportResultsPageClient from "./import-results-page-client";

const ImportResultsPage = withAdminProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/data-services/import-results`,
  async ({ catalogId, session }) => {
    const importResults: ImportResult[] = await getDataServiceImportResults(
      catalogId,
      session.accessToken,
    )
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
        text: "Importeringsresultat",
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
          importResults={importResults}
        />
      </>
    );
  },
);

export default ImportResultsPage;
