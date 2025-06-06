import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization, validUUID } from '@catalog-frontend/utils';
import {
  getDatasetTypes,
  getDataThemes,
  getFrequencies,
  getLanguages,
  getLosThemes,
  getOpenLicenses,
  getProvenanceStatements,
} from '@catalog-frontend/data-access';
import { getDatasetById } from '@dataset-catalog/app/actions/actions';
import { EditPage } from './edit-page-client';
import { withWriteProtectedPage } from '@dataset-catalog/utils/auth';
import { redirect, RedirectType } from 'next/navigation';

const EditDatasetPage = withWriteProtectedPage(
  ({ catalogId, datasetId }) => `/catalogs/${catalogId}/datasets/${datasetId}/edit`,
  async ({ catalogId, datasetId }) => {
    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
    const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

    if (!datasetId || !validUUID(datasetId)) {
      return redirect(`/catalogs/notfound`, RedirectType.replace);
    }
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
        <EditPage
          dataset={dataset}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
        />
      </>
    );
  },
);

export default EditDatasetPage;
