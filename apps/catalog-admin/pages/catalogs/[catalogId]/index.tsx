import { useRouter } from 'next/router';
import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';

import styles from './style.module.css';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../components/banner';
import { useAdminDispatch } from '../../../context/admin';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';

export const CatalogsAdminPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const adminDispatch = useAdminDispatch();

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
        },
      ] as BreadcrumbType[])
    : [];

  adminDispatch({ type: 'SET_ORG_NAME', payload: { orgName: organization.prefLabel } });

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div>
        <Banner />
        <div className={styles.card}>
          <Card
            title={localization.general}
            body={localization.catalogAdmin.description.general}
            href={`/catalogs/${catalogId}/general`}
          />
          <Card
            title={localization.catalogType.concept}
            body={localization.catalogAdmin.description.conceptCatalog}
            href={`/catalogs/${catalogId}/concepts`}
          />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { catalogId } = params;

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return {
    props: {
      organization,
    },
  };
}

export default CatalogsAdminPage;
