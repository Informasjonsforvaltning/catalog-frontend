import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../../actions/actions';
import { DatasetForm } from '../../../../../../components/dataset-form';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { DataTheme, LosTheme, Organization, ReferenceDataCode } from '@catalog-frontend/types';
import { getDatasetTypes, getDataThemes, getLosThemes, getOrganization } from '@catalog-frontend/data-access';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const dataset = await getDatasetById(catalogId, datasetId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

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
      <Breadcrumbs breadcrumbList={breadcrumbList} catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`} />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>
        <DatasetForm
          initialValues={dataset}
          submitType={'update'}
          losThemes={losThemes}
          dataThemes={dataThemes}
          datasetTypes={datasetTypes}
          searchEnv={searchEnv}
        ></DatasetForm>
      </div>
    </>
  );
}
