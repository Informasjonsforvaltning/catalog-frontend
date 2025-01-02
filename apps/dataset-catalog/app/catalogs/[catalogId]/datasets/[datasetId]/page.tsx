import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../actions/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import {
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  localization,
} from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import {
  getAllDatasetSeries,
  getDatasetTypes,
  getDataThemes,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getOpenLicenses,
  getOrganization,
  getProvenanceStatements,
} from '@catalog-frontend/data-access';
import DatasetDetailsPageClient from './dataset-details-page-client';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const dataset = await getDatasetById(catalogId, datasetId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

  const session = await getValidSession({
    callbackUrl: `/catalogs/${catalogId}/services/${datasetId}`,
  });
  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/datasets`,
      text: localization.catalogType.dataset,
    },
    {
      href: `/catalogs/${catalogId}/datasets/${datasetId}`,
      text: getTranslateText(dataset.title),
    },
  ] as BreadcrumbType[];

  const [
    losThemesResponse,
    dataThemesResponse,
    datasetTypesResponse,
    provenanceStatementsResponse,
    frequenciesResponse,
    languageResponse,
    licenceResponse,
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
    openLicenses: licenceResponse.openLicenses,
  };

  const accessToken = session?.accessToken;
  const datasetSeries = await getAllDatasetSeries(catalogId, accessToken).then((res) => res.json());

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>
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
      </div>
    </>
  );
}
