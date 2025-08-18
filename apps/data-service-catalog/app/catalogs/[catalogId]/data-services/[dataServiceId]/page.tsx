import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import {
  getTranslateText,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
  validUUID,
} from '@catalog-frontend/utils';
import {
  getCurrencies,
  getDataServiceById,
  getDistributionStatuses,
  getOpenLicenses,
  getPlannedAvailabilities,
} from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import DataServiceDetailsPageClient from './data-service-details-page-client';
import { dataServiceValidationSchema } from '../../../../../components/data-service-form/utils/validation-schema';
import { withReadProtectedPage } from '@data-service-catalog/utils/auth';
import { fetchDataServiceWithRetry } from '@data-service-catalog/utils/data-service';

const EditDataServicePage = withReadProtectedPage(
  ({ catalogId, dataServiceId }) => `/catalogs/${catalogId}/data-services/${dataServiceId}`,
  async ({ catalogId, dataServiceId, session }) => {
    if (!dataServiceId || !validUUID(dataServiceId)) {
      return redirect(`/notfound`, RedirectType.replace);
    }
    if (!session) {
      return redirectToSignIn({ callbackUrl: `/catalogs/${catalogId}/data-services/${dataServiceId}` });
    }

    // Fetch data service with retry mechanism
    const dataService = await fetchDataServiceWithRetry(catalogId, dataServiceId, `${session?.accessToken}`);

    if (!dataService || dataService.catalogId !== catalogId) {
      redirect(`/not-found`, RedirectType.replace);
    }

    const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
    const isValid = await dataServiceValidationSchema().isValid(dataService);

    const referenceDataEnv = process.env.FDK_BASE_URI ?? '';
    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';

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
        <DesignBanner
          title={localization.catalogType.dataService}
          catalogId={catalogId}
        />
        <div className='container'>
          <DataServiceDetailsPageClient
            dataService={dataService}
            catalogId={catalogId}
            dataServiceId={dataServiceId}
            hasWritePermission={hasWritePermission}
            isValid={isValid}
            referenceData={referenceData}
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
          ></DataServiceDetailsPageClient>
        </div>
      </>
    );
  },
);

export default EditDataServicePage;
