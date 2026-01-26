import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { getDatasetById } from "../../../../actions/actions";
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
  validUUID,
} from "@catalog-frontend/utils";
import {
  getAllDatasetSeries,
  getDatasetTypes,
  getDataThemes,
  getDistributionStatuses,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getMobilityDataStandards,
  getMobilityRights,
  getMobilityThemes,
  getOpenLicenses,
  getProvenanceStatements,
} from "@catalog-frontend/data-access";
import DatasetDetailsPageClient from "./dataset-details-page-client";
import { withReadProtectedPage } from "@dataset-catalog/utils/auth";
import { redirect, RedirectType } from "next/navigation";

const DatasetDetailPage = withReadProtectedPage(
  ({ catalogId, datasetId }) => `/catalogs/${catalogId}/datasets/${datasetId}`,
  async ({ catalogId, datasetId }) => {
    if (!datasetId || !validUUID(datasetId)) {
      return redirect("/catalogs/notfound", RedirectType.replace);
    }
    const dataset = await getDatasetById(catalogId, datasetId);

    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? "";
    const referenceDataEnv = process.env.FDK_BASE_URI ?? "";

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn({
        callbackUrl: `/catalogs/${catalogId}/datasets/${datasetId}`,
      });
    }
    const hasWritePermission =
      session &&
      hasOrganizationWritePermission(session?.accessToken, catalogId);

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/datasets`,
        text: localization.catalogType.dataset,
      },
      {
        href: `/catalogs/${catalogId}/datasets/${datasetId}`,
        text: dataset && getTranslateText(dataset?.title),
      },
    ] as BreadcrumbType[];

    const [
      losThemesResponse,
      dataThemesResponse,
      mobilityThemesResponse,
      datasetTypesResponse,
      provenanceStatementsResponse,
      frequenciesResponse,
      languageResponse,
      licenseResponse,
      mobilityDataStandardResponse,
      mobilityRightsResponse,
      distributionStatusResponse,
    ] = await Promise.all([
      getLosThemes(),
      getDataThemes(),
      getMobilityThemes(),
      getDatasetTypes(),
      getProvenanceStatements(),
      getFrequencies(),
      getLanguages(),
      getOpenLicenses(),
      getMobilityDataStandards(),
      getMobilityRights(),
      getDistributionStatuses(),
    ]);

    const referenceData = {
      losThemes: losThemesResponse.losNodes,
      dataThemes: dataThemesResponse.dataThemes,
      mobilityThemes: mobilityThemesResponse.mobilityThemes,
      datasetTypes: datasetTypesResponse.datasetTypes,
      provenanceStatements: provenanceStatementsResponse.provenanceStatements,
      frequencies: frequenciesResponse.frequencies,
      languages: languageResponse.linguisticSystems,
      openLicenses: licenseResponse.openLicenses,
      mobilityDataStandards: mobilityDataStandardResponse.mobilityDataStandards,
      mobilityRights: mobilityRightsResponse.mobilityConditions,
      distributionStatuses: distributionStatusResponse.distributionStatuses,
    };

    const accessToken = session?.accessToken;
    const datasetSeries = await getAllDatasetSeries(
      catalogId,
      accessToken,
    ).then((res) => res.json());

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
        <div className="container">
          {dataset && (
            <DatasetDetailsPageClient
              dataset={dataset}
              catalogId={catalogId}
              datasetId={datasetId}
              hasWritePermission={hasWritePermission}
              searchEnv={searchEnv}
              referenceDataEnv={referenceDataEnv}
              referenceData={referenceData}
              datasetSeries={datasetSeries}
            ></DatasetDetailsPageClient>
          )}
        </div>
      </>
    );
  },
);

export default DatasetDetailPage;
