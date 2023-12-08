import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Service } from '@catalog-frontend/types';
import { DetailsPageLayout, InfoCard, PageBanner } from '@catalog-frontend/ui';
import { authOptions, getTranslateText, hasOrganizationWritePermission, localization } from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getPublicServiceById } from '../../../../actions/public-services/actions';
import _ from 'lodash';
import { Button } from '@digdir/design-system-react';
import styles from './public-service-details-page.module.css';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { DeleteServiceButton } from '../../../../../components/buttons';
import PublishSwitch from '../../../../../components/publish-switch';
import { RedirectType, redirect } from 'next/navigation';

export default async function PublicServiceDetailsPage({ params }: Params) {
  const { catalogId, serviceId } = params;

  const service: Service | null = await getPublicServiceById(catalogId, serviceId);
  if (!service) {
    redirect(`/not-found`, RedirectType.replace);
  }
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);

  const language = 'nb';
  const RightColumn = () => (
    <div>
      <InfoCard>
        <InfoCard.Item
          key={`info-data-${localization.id}`}
          label={localization.id}
          labelColor='light'
        >
          <span>{service?.id}</span>
        </InfoCard.Item>

        <InfoCard.Item
          key={`info-data-${localization.publicationState.state}`}
          label={localization.publicationState.state}
          labelColor='light'
        >
          <PublishSwitch
            catalogId={catalogId}
            serviceId={serviceId}
            isPublished={service?.published ?? false}
            type='public-services'
            disabled={!hasWritePermission}
          />

          <div className={styles.greyFont}>
            {service?.published
              ? localization.publicationState.publishedInFDK
              : localization.publicationState.unpublished}
          </div>
        </InfoCard.Item>
      </InfoCard>
    </div>
  );

  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <DetailsPageLayout
        headingTitle={getTranslateText(service?.title ?? '', language)}
        loading={false}
        mainColumn={
          <InfoCard>
            {!_.isEmpty(getTranslateText(service?.description ?? '', language)) && (
              <InfoCard.Item label={`${localization.description}:`}>
                <div>
                  <p>{getTranslateText(service?.description ?? '', language)}</p>
                </div>
              </InfoCard.Item>
            )}
          </InfoCard>
        }
        rightColumn={<RightColumn />}
        buttons={
          hasWritePermission && (
            <div className={styles.actionButtons}>
              <Button
                size='small'
                as={Link}
                href={`/catalogs/${catalogId}/public-services/${serviceId}/edit`}
              >
                Rediger
              </Button>

              <DeleteServiceButton
                catalogId={catalogId}
                serviceId={serviceId}
                type='public-services'
              />
            </div>
          )
        }
      ></DetailsPageLayout>
    </>
  );
}
