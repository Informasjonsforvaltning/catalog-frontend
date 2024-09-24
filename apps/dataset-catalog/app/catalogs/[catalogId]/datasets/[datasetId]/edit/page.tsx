import { Breadcrumbs } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../../actions/actions';
import { DatasetForm } from '../../../../../../components/dataset-form';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const dataset = await getDatasetById(catalogId, datasetId);

  return (
    <>
      <Breadcrumbs />
      <div className='container'>
        <DatasetForm
          initialValues={dataset}
          submitType={'update'}
        ></DatasetForm>
      </div>
    </>
  );
}
