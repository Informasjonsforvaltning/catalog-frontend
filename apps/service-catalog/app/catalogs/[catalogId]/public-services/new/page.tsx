import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { BasicServiceForm } from '../../../../../components/basic-service-form';
import { Heading } from '@digdir/design-system-react';
import { PageBanner } from '@catalog-frontend/ui';
import { Organization, ReferenceDataCode } from '@catalog-frontend/types';
import { getAdmsStatuses, getOrganization } from '@catalog-frontend/data-access';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import styles from './public-service-new-page.module.css';

export default async function NewPublicServicePage({ params }: Params) {
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());
  const statuses: ReferenceDataCode[] = statusesResponse.statuses;

  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <div className='container'>
        <Heading
          size='medium'
          className={styles.heading}
        >
          {localization.serviceCatalog.infoAboutService}
        </Heading>
        <BasicServiceForm
          catalogId={catalogId}
          type='public-services'
          statuses={statuses}
        />
      </div>
    </>
  );
}
