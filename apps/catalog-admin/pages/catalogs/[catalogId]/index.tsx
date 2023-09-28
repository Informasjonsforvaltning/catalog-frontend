import { useRouter } from 'next/router';
import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';

import styles from '../../shared-style.module.css';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../components/banner';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { serverSidePropsWithAdminPermissions } from '../../../utils/auth';
import { InformationSquareIcon, TableIcon } from '@navikt/aksel-icons';

export const CatalogsAdminPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div>
        <Banner orgName={organization?.prefLabel} />
        <div className={styles.card}>
          <Card
            icon={<InformationSquareIcon fontSize='3rem' />}
            title={localization.general}
            body={localization.catalogAdmin.description.general}
            href={`/catalogs/${catalogId}/general`}
          />
          <Card
            icon={
              <TableIcon
                title='a11y-title'
                fontSize='3rem'
              />
            }
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
