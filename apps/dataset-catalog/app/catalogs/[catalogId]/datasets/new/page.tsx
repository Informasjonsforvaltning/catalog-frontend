import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { DatasetForm } from '../../../../../components/dataset-form';
import { datasetToBeCreatedTemplate } from '../../../../../components/dataset-form/dataset-initial-values';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';

export default async function NewDatasetPage({ params }: Params) {
  const initialValues = datasetToBeCreatedTemplate();
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

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
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
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
