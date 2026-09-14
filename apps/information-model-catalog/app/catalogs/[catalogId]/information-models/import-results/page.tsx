import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { ImportResult } from "@catalog-frontend/types";
import { getInformationModelImportResults } from "@catalog-frontend/data-access";
import { withAdminProtectedPage } from "@information-model-catalog/utils/auth";
import ImportResultsPageClient from "./import-results-page-client";

const ImportResultsPage = withAdminProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/information-models/import-results`,
  async ({ catalogId, session }) => {
    const importResults: ImportResult[] =
      await getInformationModelImportResults(catalogId, session.accessToken)
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
      {
        href: `/catalogs/${catalogId}/information-models/import-results`,
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
          title={localization.catalogType.informationModel}
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
