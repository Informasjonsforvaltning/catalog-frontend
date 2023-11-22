import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Service } from '@catalog-frontend/types';
import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { getPublicServices } from '../../../../../actions/public-services/actions';
import ServiceForm from '../../../../../components/service-form';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function EditPublicServicePage({ params }: Params) {
  const { catalogId, serviceId } = params;
  const services: Service[] = await getPublicServices(catalogId);
  const service: Service | undefined = services.find((s) => s.id === serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <div>
      <Breadcrumbs />
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <ServiceForm
        catalogId={catalogId}
        service={service}
      />
    </div>
  );
}
