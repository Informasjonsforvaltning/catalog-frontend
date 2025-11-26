import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import {
  getDatasetTypes,
  getMobilityThemes,
  getFrequencies,
  getLanguages,
  getOpenLicenses,
  getProvenanceStatements,
  getDataThemes,
  getLosThemes,
  getMobilityDataStandards,
  getMobilityRights,
  getDistributionStatuses,
} from "@catalog-frontend/data-access";
import { datasetToBeCreatedTemplate } from "@dataset-catalog/components/dataset-form/utils/dataset-initial-values";
import { NewPage } from "./new-page-client";
import { withWriteProtectedPage } from "@dataset-catalog/utils/auth";
import { ApplicationProfile } from "@catalog-frontend/types";

const NewTransportDatasetPage = withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/datasets/new`,
  async ({ catalogId }) => {
    const dataset = datasetToBeCreatedTemplate(
      ApplicationProfile.MOBILITYDCATAP,
    );

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
      getLosThemes().then((res) => res.json()),
      getDataThemes().then((res) => res.json()),
      getMobilityThemes().then((res) => res.json()),
      getDatasetTypes().then((res) => res.json()),
      getProvenanceStatements().then((res) => res.json()),
      getFrequencies().then((res) => res.json()),
      getLanguages().then((res) => res.json()),
      getOpenLicenses().then((res) => res.json()),
      getMobilityDataStandards().then((res) => res.json()),
      getMobilityRights().then((res) => res.json()),
      getDistributionStatuses().then((res) => res.json()),
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

    const breadcrumbList: BreadcrumbType[] = [
      {
        href: `/catalogs/${catalogId}/datasets`,
        text: localization.catalogType.dataset,
      },
      {
        href: `/catalogs/${catalogId}/datasets/new-transport`,
        text: localization.button.addMobilityDataset,
      },
    ];

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
        <NewPage
          catalogId={catalogId}
          dataset={dataset}
          referenceData={referenceData}
          referenceDataEnv={process.env.FDK_BASE_URI ?? ""}
          searchEnv={process.env.FDK_SEARCH_SERVICE_BASE_URI ?? ""}
        />
      </>
    );
  },
);

export default NewTransportDatasetPage;
