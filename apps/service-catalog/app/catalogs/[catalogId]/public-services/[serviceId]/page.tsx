import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { Organization, ReferenceDataCode, Service } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DetailsPageLayout, InfoCard, PageBanner, Tag } from '@catalog-frontend/ui';
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
import BasicServiceFormInfoCardItems from '../../../../../components/basic-form-info-card-items';

export default async function PublicServiceDetailsPage({ params }: Params) {
  const { catalogId, serviceId } = params;

  const service: Service | null = await getPublicServiceById(catalogId, serviceId);
  if (!service) {
    redirect(`/not-found`, RedirectType.replace);
  }
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const session = await getServerSession(authOptions);
  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

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

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/public-services`,
      text: localization.catalogType.publicService,
    },
    {
      href: `/catalogs/${catalogId}/public-services/${serviceId}`,
      text: getTranslateText(service.title),
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.publicService}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <DetailsPageLayout
        headingTitle={
          <div className={styles.status}>
            <h2>{getTranslateText(service?.title ?? '', language)}</h2>
            {service.status && (
              <Tag>{getTranslateText(statuses.find((s) => s.uri === service?.status)?.label) as string}</Tag>
            )}
          </div>
        }
        loading={false}
        mainColumn={
          <InfoCard>
            {!_.isEmpty(getTranslateText(service?.description ?? '', language)) && (
              <BasicServiceFormInfoCardItems
                service={service}
                language={language}
              />
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
