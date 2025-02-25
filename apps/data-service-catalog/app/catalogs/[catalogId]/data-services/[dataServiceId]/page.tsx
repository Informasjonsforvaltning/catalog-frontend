import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, getValidSession, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import {
  getCurrencies,
  getDataServiceById,
  getDistributionStatuses,
  getOpenLicenses,
  getOrganization,
  getPlannedAvailabilities,
} from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import DataServiceDetailsPageClient from './data-service-details-page-client';

export default async function EditDataServicePage({ params }: Params) {
  const { catalogId, dataServiceId } = params;
  const session = await getValidSession({ callbackUrl: `/catalogs/${catalogId}/data-services/${dataServiceId}/edit` });
  const dataService = await getDataServiceById(catalogId, dataServiceId, `${session?.accessToken}`).then((response) => {
    if (response.ok) return response.json();
  });
  if (!dataService || dataService.catalogId !== catalogId) {
    redirect(`/not-found`, RedirectType.replace);
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

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
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.dataService}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>
        <DataServiceDetailsPageClient
          dataService={dataService}
          catalogId={catalogId}
          dataServiceId={dataServiceId}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
        ></DataServiceDetailsPageClient>
      </div>
    </>
  );
}
