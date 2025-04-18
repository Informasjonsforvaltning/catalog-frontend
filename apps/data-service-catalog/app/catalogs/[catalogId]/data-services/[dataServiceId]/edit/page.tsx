import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import {
  getCurrencies,
  getDistributionStatuses,
  getOpenLicenses,
  getPlannedAvailabilities,
} from '@catalog-frontend/data-access';
import { getTranslateText, getValidSession, localization, redirectToSignIn } from '@catalog-frontend/utils';
import { getDataServiceById } from '@catalog-frontend/data-access';
import DataServiceForm from '../../../../../../components/data-service-form';
import { redirect, RedirectType } from 'next/navigation';

export default async function EditDataServicePage({
  params,
}: {
  params: Promise<{ catalogId: string; dataServiceId: string }>;
}) {
  const { catalogId, dataServiceId } = await params;
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn({ callbackUrl: `/catalogs/${catalogId}/data-services/${dataServiceId}/edit` });
  }
  const dataService = await getDataServiceById(catalogId, dataServiceId, `${session?.accessToken}`).then((response) => {
    if (response.ok) return response.json();
  });
  if (!dataService || dataService.catalogId !== catalogId) {
    redirect(`/not-found`, RedirectType.replace);
  }
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

  const [licenseResponse, statusResponse, availabilitiesResponse, currenciesResponse] = await Promise.all([
    getOpenLicenses().then((res) => res.json()),
    getDistributionStatuses().then((res) => res.json()),
    getPlannedAvailabilities().then((res) => res.json()),
    getCurrencies().then((res) => res.json()),
  ]);

  const referenceData = {
    distributionStatuses: statusResponse.distributionStatuses,
    openLicenses: licenseResponse.openLicenses,
    plannedAvailabilities: availabilitiesResponse.plannedAvailabilities,
    currencies: currenciesResponse.currencies,
  };

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/${dataServiceId}`,
      text: getTranslateText(dataService.title),
    },
    {
      href: `/catalogs/${catalogId}/data-services/${dataServiceId}/edit`,
      text: localization.edit,
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
        initialValues={dataService}
        searchEnv={searchEnv}
        referenceData={referenceData}
        referenceDataEnv={referenceDataEnv}
        submitType={'update'}
      />
    </>
  );
}
