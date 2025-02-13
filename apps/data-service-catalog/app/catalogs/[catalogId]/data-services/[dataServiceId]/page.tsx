import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getDataService } from '../../../../actions/actions';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';

export default async function EditDataServicePage({ params }: Params) {
  const { catalogId, dataServiceId } = params;
  const dataService = await getDataService(catalogId, dataServiceId).catch((error) => console.log(error.message));
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  if (!dataService || dataService.catalogId !== catalogId) {
    redirect(`/not-found`, RedirectType.replace);
  }

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/${dataServiceId}`,
      text: getTranslateText(dataService.title),
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.dataService}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <div className='container'>Her kommer detaljside for {getTranslateText(dataService.title)}</div>
    </>
  );
}
