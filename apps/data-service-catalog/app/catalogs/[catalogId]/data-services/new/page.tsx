import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui-v2";
import {
  getCurrencies,
  getDistributionStatuses,
  getOpenLicenses,
  getPlannedAvailabilities,
} from "@catalog-frontend/data-access";

import { dataServiceToBeCreatedTemplate } from "../../../../../components/data-service-form/utils/data-service-initial-values";
import { localization } from "@catalog-frontend/utils";
import { withWriteProtectedPage } from "@data-service-catalog/utils/auth";
import { NewDataServicePageClient } from "./new-page-client";

const NewDataServicePage = withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/data-services/new`,
  async ({ catalogId }) => {
    const initialValues = dataServiceToBeCreatedTemplate();
    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? "";
    const referenceDataEnv = process.env.FDK_BASE_URI ?? "";

    const [
      licenseResponse,
      statusResponse,
      availabilitiesResponse,
      currenciesResponse,
    ] = await Promise.all([
      getOpenLicenses(),
      getDistributionStatuses(),
      getPlannedAvailabilities(),
      getCurrencies(),
    ]);

    const referenceData = {
      openLicenses: licenseResponse.openLicenses,
      distributionStatuses: statusResponse.distributionStatuses,
      plannedAvailabilities: availabilitiesResponse.plannedAvailabilities,
      currencies: currenciesResponse.currencies,
    };

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/data-services`,
        text: localization.catalogType.dataService,
      },
      {
        href: `/catalogs/${catalogId}/data-services/new`,
        text: localization.dataServiceCatalog.button.newDataService,
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
        <NewDataServicePageClient
          catalogId={catalogId}
          initialValues={initialValues}
          searchEnv={searchEnv}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
        />
      </>
    );
  },
);

export default NewDataServicePage;
