import { useRouter } from 'next/router';
import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';

import styles from './style.module.css';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../components/banner';
import { useAdminDispatch } from '../../../context/admin';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { useEffect } from 'react';
import { serverSidePropsWithAdminPermissions } from '../../../utils/auth';

export const CatalogsAdminPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const adminDispatch = useAdminDispatch();

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.manage.catalogAdmin),
        },
      ] as BreadcrumbType[])
    : [];

  useEffect(() => {
    adminDispatch({ type: 'SET_ORG_NAME', payload: { orgName: organization.prefLabel } });
  }, [organization.prefLabel]);

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

export async function getServerSideProps({ req, res, params }) {
  return serverSidePropsWithAdminPermissions({ req, res, params }, async () => {
    const { catalogId } = params;

    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    return {
      organization,
    };
  });
}

export default CatalogsAdminPage;
