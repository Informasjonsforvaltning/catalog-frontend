import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../../actions/actions';
import { DatasetForm } from '../../../../../../components/dataset-form';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const dataset = await getDatasetById(catalogId, datasetId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

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
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>
        <DatasetForm
          initialValues={dataset}
          submitType={'update'}
        ></DatasetForm>
      </div>
    </>
  );
}
