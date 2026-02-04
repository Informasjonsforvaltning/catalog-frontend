import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization, validUUID } from "@catalog-frontend/utils";
import { getConceptImportResultById } from "@catalog-frontend/data-access";
import { redirect, RedirectType } from "next/navigation";
import ImportResultDetailsPageClient from "./import-result-details-page-client";
import { withAdminProtectedPage } from "@concept-catalog/utils/auth";

const ImportResultDetailsPage = withAdminProtectedPage(
  ({ catalogId, resultId }) =>
    `/catalogs/${catalogId}/concepts/import-results/${resultId}`,
  async ({ catalogId, resultId, session }) => {
    if (!resultId || !validUUID(resultId)) {
      return redirect("/notfound", RedirectType.replace);
    }
    const importResult = await getConceptImportResultById(
      catalogId,
      resultId,
      session.accessToken,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    if (!importResult || importResult.catalogId !== catalogId) {
      redirect("/not-found", RedirectType.replace);
    }

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/concepts`,
        text: localization.catalogType.concept,
      },
      {
        href: `/catalogs/${catalogId}/concepts/import-results`,
        text: "Importeringsresultat",
      },
      {
        href: `/catalogs/${catalogId}/concepts/import-results/${resultId}`,
        text: `Import #${importResult.id.slice(0, 5).toUpperCase()}`,
      },
    ] as BreadcrumbType[];

    return (
      <div>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <ImportResultDetailsPageClient
          catalogId={catalogId}
          importResult={importResult}
        />
      </div>
    );
  },
);

export default ImportResultDetailsPage;
