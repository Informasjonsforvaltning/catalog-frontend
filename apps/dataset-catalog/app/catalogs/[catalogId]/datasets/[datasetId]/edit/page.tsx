import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  getTranslateText,
  localization,
  validUUID,
} from "@catalog-frontend/utils";
import {
  getDatasetTypes,
  getDataThemes,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getOpenLicenses,
  getProvenanceStatements,
  getMobilityThemes,
  getMobilityDataStandards,
  getMobilityRights,
  getDistributionStatuses,
} from "@catalog-frontend/data-access";
import { getDatasetById } from "@dataset-catalog/app/actions/actions";
import { EditPage } from "./edit-page-client";
import { withWriteProtectedPage } from "@dataset-catalog/utils/auth";
import { redirect, RedirectType } from "next/navigation";

const EditDatasetPage = withWriteProtectedPage(
  ({ catalogId, datasetId }) =>
    `/catalogs/${catalogId}/datasets/${datasetId}/edit`,
  async ({ catalogId, datasetId }) => {
    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? "";
    const referenceDataEnv = process.env.FDK_BASE_URI ?? "";

    if (!datasetId || !validUUID(datasetId)) {
      return redirect(`/catalogs/notfound`, RedirectType.replace);
    }
    const dataset = await getDatasetById(catalogId, datasetId);

    const [
      losThemesResponse,
      dataThemesResponse,
      datasetTypesResponse,
      provenanceStatementsResponse,
      frequenciesResponse,
      languageResponse,
      licenseResponse,
      mobilityThemesResponse,
      mobilityDataStandardResponse,
      mobilityRightsResponse,
      distributionStatusResponse,
    ] = await Promise.all([
      getLosThemes().then((res) => res.json()),
      getDataThemes().then((res) => res.json()),
      getDatasetTypes().then((res) => res.json()),
      getProvenanceStatements().then((res) => res.json()),
      getFrequencies().then((res) => res.json()),
      getLanguages().then((res) => res.json()),
      getOpenLicenses().then((res) => res.json()),
      getMobilityThemes().then((res) => res.json()),
      getMobilityDataStandards().then((res) => res.json()),
      getMobilityRights().then((res) => res.json()),
      getDistributionStatuses().then((res) => res.json()),
    ]);

    const referenceData = {
      losThemes: losThemesResponse.losNodes,
      dataThemes: dataThemesResponse.dataThemes,
      datasetTypes: datasetTypesResponse.datasetTypes,
      provenanceStatements: provenanceStatementsResponse.provenanceStatements,
      frequencies: frequenciesResponse.frequencies,
      languages: languageResponse.linguisticSystems,
      openLicenses: licenseResponse.openLicenses,
      mobilityThemes: mobilityThemesResponse.mobilityThemes,
      mobilityDataStandards: mobilityDataStandardResponse.mobilityDataStandards,
      mobilityRights: mobilityRightsResponse.mobilityConditions,
      distributionStatuses: distributionStatusResponse.distributionStatuses,
    };

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/datasets`,
        text: localization.catalogType.dataset,
      },
      {
        href: `/catalogs/${catalogId}/datasets/${datasetId}`,
        text: getTranslateText(dataset.title),
      },
      {
        href: `/catalogs/${catalogId}/datasets/${datasetId}/edit`,
        text: localization.edit,
      },
    ] as BreadcrumbType[]; //fix type. choose first element from gettranslateText if string[]

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
        <EditPage
          dataset={dataset}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
        />
      </>
    );
  },
);

export default EditDatasetPage;
