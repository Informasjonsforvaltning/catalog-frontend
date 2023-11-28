import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Service } from '@catalog-frontend/types';
import { DetailsPageLayout, InfoCard, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getPublicServiceById } from '../../../../actions/public-services/actions';

export default async function EditPublicServicePage({ params }: Params) {
  const { catalogId, serviceId } = params;
  const service: Service = await getPublicServiceById(catalogId, serviceId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <DetailsPageLayout
        loading={false}
        mainColumn={
          <InfoCard>
            <InfoCard.Item>
              <div>Detailspage</div>
            </InfoCard.Item>
          </InfoCard>
        }
        rightColumn={
          <InfoCard>
            <InfoCard.Item>
              <div>Right</div>
            </InfoCard.Item>
          </InfoCard>
        }
        headingTitle={<p>Min tittel</p>}
      ></DetailsPageLayout>
    </>
  );
}
