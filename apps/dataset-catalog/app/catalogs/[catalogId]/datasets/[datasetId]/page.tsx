import { Breadcrumbs, BreadcrumbType } from '@catalog-frontend/ui';
import { getDatasetById } from '../../../../actions/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';

export default async function EditDatasetPage({ params }: Params) {
  const { catalogId, datasetId } = params;
  const dataset = await getDatasetById(catalogId, datasetId);

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/datasets`,
      text: localization.catalogType.dataset,
    },
    {
      href: `/catalogs/${catalogId}/datasets/${datasetId}`,
      text: getTranslateText(dataset.title),
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div className='container'>Her kommer details-page</div>
    </>
  );
}
