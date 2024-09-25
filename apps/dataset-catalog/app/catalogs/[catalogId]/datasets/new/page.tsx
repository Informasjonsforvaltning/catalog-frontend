import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { DatasetForm } from '../../../../../components/dataset-form';
import { datasetToBeCreatedTemplate } from '../../../../../components/dataset-form/dataset-initial-values';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { localization } from '@catalog-frontend/utils';

export default async function NewDatasetPage({ params }: Params) {
  const initialValues = datasetToBeCreatedTemplate();

  const { catalogId } = params;

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
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title='Datasettkatalog'
        subtitle='Høgskolen for IT og arkitektur'
      />
      <div className='container'>
        <DatasetForm
          initialValues={initialValues}
          submitType={'create'}
        ></DatasetForm>
      </div>
    </>
  );
}
