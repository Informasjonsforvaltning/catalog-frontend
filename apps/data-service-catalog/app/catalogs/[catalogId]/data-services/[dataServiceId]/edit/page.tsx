import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import {
  getCurrencies,
  getDistributionStatuses,
  getOpenLicenses,
  getPlannedAvailabilities,
} from '@catalog-frontend/data-access';
import { getTranslateText, localization, redirectToSignIn, validUUID } from '@catalog-frontend/utils';
import { redirect, RedirectType } from 'next/navigation';
import { withWriteProtectedPage } from '@data-service-catalog/utils/auth';
import { EditPage } from './edit-page-client';
import { fetchDataServiceWithRetry } from '@data-service-catalog/utils/data-service';

const EditDataServicePage = withWriteProtectedPage(
  ({ catalogId, dataServiceId }) => `/catalogs/${catalogId}/data-services/${dataServiceId}/edit`,
  async ({ catalogId, dataServiceId, session }) => {
    if (!dataServiceId || !validUUID(dataServiceId)) {
      return redirect(`/notfound`, RedirectType.replace);
    }
    if (!session) {
      return redirectToSignIn({ callbackUrl: `/catalogs/${catalogId}/data-services/${dataServiceId}/edit` });
    }

    // Fetch data service with retry mechanism
    const dataService = await fetchDataServiceWithRetry(catalogId, dataServiceId, `${session?.accessToken}`);

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
        <EditPage
          catalogId={catalogId}
          dataService={dataService}
          searchEnv={searchEnv}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
        />
      </>
    );
  },
);

export default EditDataServicePage;
