import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import {getDistributionStatuses, getOpenLicenses, getOrganization} from '@catalog-frontend/data-access';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getDataService } from '../../../../../actions/actions';
import { Organization } from '@catalog-frontend/types';
import DataServiceForm from '../../../../../../components/data-service-form';

export default async function EditDataServicePage({ params }: Params) {
  const { catalogId, dataServiceId } = params;
  const dataService = await getDataService(catalogId, dataServiceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const searchEnv = process.env.FDK_SEARCH_SERVICE_BASE_URI ?? '';
  const referenceDataEnv = process.env.FDK_BASE_URI ?? '';

  const [licenceResponse, statusResponse] = await Promise.all([
    getOpenLicenses().then((res) => res.json()),
    getDistributionStatuses().then((res) => res.json()),
  ]);

  const referenceData = {
    distributionStatuses: statusResponse.distributionStatuses,
    openLicenses: licenceResponse.openLicenses,
  };

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/data-services`,
      text: localization.catalogType.dataService,
    },
    {
      href: `/catalogs/${catalogId}/data-services/${dataServiceId}`,
      text: getTranslateText(dataService.title),
    },
    {
      href: `/catalogs/${catalogId}/data-services/${dataServiceId}/edit`,
      text: localization.edit,
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
        initialValues={dataService}
        searchEnv={searchEnv}
        referenceData={referenceData}
        referenceDataEnv={referenceDataEnv}
        submitType={'update'}
      />
    </>
  );
}
