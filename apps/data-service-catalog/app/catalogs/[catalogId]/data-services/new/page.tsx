import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import {
  getCurrencies,
  getDistributionStatuses,
  getOpenLicenses,
  getPlannedAvailabilities,
} from '@catalog-frontend/data-access';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import DataServiceForm from '../../../../../components/data-service-form';
import { dataServiceToBeCreatedTemplate } from '../../../../../components/data-service-form/utils/data-service-initial-values';
import { localization } from '@catalog-frontend/utils';

export default async function NewDataServicePage({ params }: Params) {
  const { catalogId } = params;
  const initialValues = dataServiceToBeCreatedTemplate();
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

  const [licenseResponse, statusResponse, availabilitiesResponse, currenciesResponse] = await Promise.all([
    getOpenLicenses().then((res) => res.json()),
    getDistributionStatuses().then((res) => res.json()),
    getPlannedAvailabilities().then((res) => res.json()),
    getCurrencies().then((res) => res.json()),
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
      <DataServiceForm
        initialValues={initialValues}
        searchEnv={searchEnv}
        referenceData={referenceData}
        referenceDataEnv={referenceDataEnv}
        submitType={'create'}
      />
    </>
  );
}
