import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization, validInformationModelID } from "@catalog-frontend/utils";
import { getInformationModelImportResultById } from "@catalog-frontend/data-access";
import { redirect, RedirectType } from "next/navigation";
import ImportResultDetailsPageClient from "./import-result-details-page-client";
import { withAdminProtectedPage } from "@information-model-catalog/utils/auth";

const ImportResultDetailsPage = withAdminProtectedPage(
  ({ catalogId, resultId }) =>
    `/catalogs/${catalogId}/information-models/import-results/${resultId}`,
  async ({ catalogId, resultId, session }) => {
    if (!resultId || !validInformationModelID(resultId)) {
      return redirect("/notfound", RedirectType.replace);
    }
    const importResult = await getInformationModelImportResultById(
      catalogId,
      resultId,
      session.accessToken,
    ).then((response) => {
      if (response.ok) return response.json();
    });
    if (!importResult || importResult.catalogId !== catalogId) {
      redirect("/not-found", RedirectType.replace);
    }

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
      {
        href: `/catalogs/${catalogId}/information-models/import-results`,
        text: "Importeringsresultat",
      },
      {
        href: `/catalogs/${catalogId}/information-models/import-results/${resultId}`,
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
          title={localization.catalogType.informationModel}
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
