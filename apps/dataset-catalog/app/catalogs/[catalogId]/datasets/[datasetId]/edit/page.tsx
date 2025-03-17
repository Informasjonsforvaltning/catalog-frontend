import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../../actions/actions';
import { DatasetForm } from '../../../../../../components/dataset-form';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import {
  getDatasetTypes,
  getDataThemes,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getOpenLicenses,
  getProvenanceStatements,
} from '@catalog-frontend/data-access';
export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';
  const dataset = await getDatasetById(catalogId, datasetId);

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
  ] as BreadcrumbType[];

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

      <DatasetForm
        initialValues={dataset}
        submitType={'update'}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
      ></DatasetForm>
    </>
  );
}
