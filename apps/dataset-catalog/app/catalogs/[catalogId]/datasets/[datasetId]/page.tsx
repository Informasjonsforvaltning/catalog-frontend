import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../actions/actions';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
  redirectToSignIn,
  validUUID,
} from '@catalog-frontend/utils';
import {
  getAllDatasetSeries,
  getDatasetTypes,
  getDataThemes,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getOpenLicenses,
  getProvenanceStatements,
} from '@catalog-frontend/data-access';
import DatasetDetailsPageClient from './dataset-details-page-client';
import { withReadProtectedPage } from '@dataset-catalog/utils/auth';
import { redirect, RedirectType } from 'next/navigation';

const DatasetDetailPage = withReadProtectedPage(
  ({ catalogId, datasetId }) => `/catalogs/${catalogId}/datasets/${datasetId}`,
  async ({ catalogId, datasetId }) => {
    if (!datasetId || !validUUID(datasetId)) {
      return redirect(`/catalogs/notfound`, RedirectType.replace);
    }
    const dataset = await getDatasetById(catalogId, datasetId);

    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
    const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn({ callbackUrl: `/catalogs/${catalogId}/datasets/${datasetId}` });
    }
    const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);

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
      datasetTypesResponse,
      provenanceStatementsResponse,
      frequenciesResponse,
      languageResponse,
      licenseResponse,
    ] = await Promise.all([
      getLosThemes().then((res) => res.json()),
      getDataThemes().then((res) => res.json()),
      getDatasetTypes().then((res) => res.json()),
      getProvenanceStatements().then((res) => res.json()),
      getFrequencies().then((res) => res.json()),
      getLanguages().then((res) => res.json()),
      getOpenLicenses().then((res) => res.json()),
    ]);

    const referenceData = {
      losThemes: losThemesResponse.losNodes,
      dataThemes: dataThemesResponse.dataThemes,
      datasetTypes: datasetTypesResponse.datasetTypes,
      provenanceStatements: provenanceStatementsResponse.provenanceStatements,
      frequencies: frequenciesResponse.frequencies,
      languages: languageResponse.linguisticSystems,
      openLicenses: licenseResponse.openLicenses,
    };

    const accessToken = session?.accessToken;
    const datasetSeries = await getAllDatasetSeries(catalogId, accessToken).then((res) => res.json());

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
        <div className='container'>
          {dataset && (
            <DatasetDetailsPageClient
              dataset={dataset}
              catalogId={catalogId}
              datasetId={datasetId}
              hasWritePermission={hasWritePermission}
              searchEnv={searchEnv}
              referenceDataEnv={referenceDataEnv}
              referenceData={referenceData}
              datasetSeries={datasetSeries._embedded.datasets}
            ></DatasetDetailsPageClient>
          )}
        </div>
      </>
    );
  },
);

export default DatasetDetailPage;
