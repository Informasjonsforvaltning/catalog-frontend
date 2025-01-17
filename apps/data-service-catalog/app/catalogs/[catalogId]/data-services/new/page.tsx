import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { getOrganization } from '@catalog-frontend/data-access';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import DataServiceForm from '../../../../../components/data-service-form';
import { dataServiceToBeCreatedTemplate } from '../../../../../components/data-service-form/utils/data-service-initial-values';

export default async function NewDataServicePage({ params }: Params) {
  const { catalogId } = params;
  const initialValues = dataServiceToBeCreatedTemplate();
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/new`,
      text: localization.dataServiceCatalog.button.newDataService,
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
      <DataServiceForm
        initialValues={initialValues}
        referenceDataEnv={referenceDataEnv}
        submitType={'create'}
      />
    </>
  );
}
