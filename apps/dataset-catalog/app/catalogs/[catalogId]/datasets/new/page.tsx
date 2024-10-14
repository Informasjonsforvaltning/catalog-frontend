import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { DatasetForm } from '../../../../../components/dataset-form';
import { datasetToBeCreatedTemplate } from '../../../../../components/dataset-form/dataset-initial-values';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { DataTheme, LosTheme, Organization, ReferenceDataCode } from '@catalog-frontend/types';
import { getDatasetTypes, getDataThemes, getLosThemes, getOrganization } from '@catalog-frontend/data-access';

export default async function NewDatasetPage({ params }: Params) {
  const initialValues = datasetToBeCreatedTemplate();
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';

  const [losThemesResponse, dataThemesResponse, datasetTypesResponse] = await Promise.all([
    getLosThemes().then((res) => res.json()),
    getDataThemes().then((res) => res.json()),
    getDatasetTypes().then((res) => res.json()),
  ]);

  const losThemes: LosTheme[] = losThemesResponse.losNodes;
  const dataThemes: DataTheme[] = dataThemesResponse.dataThemes;
  const datasetTypes: ReferenceDataCode[] = datasetTypesResponse.datasetTypes;

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/datasets`,
      text: localization.catalogType.dataset,
    },
    {
      href: `/catalogs/${catalogId}/datasets/new`,
      text: localization.button.addDataset,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`} />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>
        <DatasetForm
          initialValues={initialValues}
          submitType={'create'}
          losThemes={losThemes}
          dataThemes={dataThemes}
          datasetTypes={datasetTypes}
          searchEnv={searchEnv}
        ></DatasetForm>
      </div>
    </>
  );
}
