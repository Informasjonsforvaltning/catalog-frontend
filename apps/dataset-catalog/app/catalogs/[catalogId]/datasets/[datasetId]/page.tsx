import { Breadcrumbs } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../actions/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const dataset = await getDatasetById(catalogId, datasetId);

  return (
    <>
      <Breadcrumbs />
      <div className='container'>Her kommer details-page</div>
    </>
  );
}
