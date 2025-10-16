import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import {
  getDatasetTypes,
  getTransportThemes,
  getFrequencies,
  getLanguages,
  getOpenLicenses,
  getProvenanceStatements,
} from '@catalog-frontend/data-access';
import { transportDatasetToBeCreatedTemplate } from '@dataset-catalog/components/dataset-form/utils/transport-dataset-initial-values';
import { NewPage } from './new-page-client';
import { withWriteProtectedPage } from '@dataset-catalog/utils/auth';

const NewTransportDatasetPage = withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/datasets/new`,
  async ({ catalogId }) => {
    const dataset = transportDatasetToBeCreatedTemplate();
    const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
    const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

    const [
      transportThemesResponse,
      datasetTypesResponse,
      provenanceStatementsResponse,
      frequenciesResponse,
      languageResponse,
      licenseResponse,
    ] = await Promise.all([
      getTransportThemes().then((res) => res.json()),
      getDatasetTypes().then((res) => res.json()),
      getProvenanceStatements().then((res) => res.json()),
      getFrequencies().then((res) => res.json()),
      getLanguages().then((res) => res.json()),
      getOpenLicenses().then((res) => res.json()),
    ]);

    const referenceData = {
      transportThemes: transportThemesResponse.transportThemes,
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
        href: `/catalogs/${catalogId}/datasets/new-transport`,
        text: localization.button.addDataset,
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
        <NewPage
          catalogId={catalogId}
          dataset={dataset}
          referenceData={referenceData}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
        /> 
        
      </>
    );
  },
);

export default NewTransportDatasetPage;
