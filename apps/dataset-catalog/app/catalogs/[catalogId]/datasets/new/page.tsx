import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { DatasetForm } from '../../../../../components/dataset-form';
import { datasetToBeCreatedTemplate } from '../../../../../components/dataset-form/dataset-initial-values';

export default function NewDatasetPage() {
  const initialValues = datasetToBeCreatedTemplate();

  return (
    <>
      <Breadcrumbs />
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
