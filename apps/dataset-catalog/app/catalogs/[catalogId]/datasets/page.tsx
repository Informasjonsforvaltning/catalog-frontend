import { Dataset } from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  getServerDatasetsPageSettings,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
} from "@catalog-frontend/utils";
import { getDatasets } from "../../../actions/actions";
import DatasetsPageClient from "./datasets-page-client";
import { cookies } from "next/headers";
import { withReadProtectedPage } from "@dataset-catalog/utils/auth";

const DatasetSearchHitsPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/datasets`,
  async ({ catalogId }) => {
    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(`/catalogs/${catalogId}/datasets`);
    }

    const datasets: Dataset[] = await getDatasets(catalogId);
    const hasWritePermission = hasOrganizationWritePermission(
      session.accessToken,
      catalogId,
    );

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/datasets`,
        text: localization.catalogType.dataset,
      },
    ] as BreadcrumbType[];

    const pageSettings = getServerDatasetsPageSettings(await cookies());

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          catalogId={catalogId}
          title={localization.catalogType.dataset}
        />
        <DatasetsPageClient
          datasets={datasets}
          hasWritePermission={hasWritePermission}
          catalogId={catalogId}
          pageSettings={pageSettings}
        />
      </>
    );
  },
);

export default DatasetSearchHitsPage;
