import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';
import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../utils/auth';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { PaletteIcon, PersonIcon } from '@navikt/aksel-icons';

export const ConceptsPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />
      <div className='card'>
        <Card
          icon={<PaletteIcon fontSize='3rem' />}
          title={localization.catalogAdmin.design}
          body={localization.catalogAdmin.manage.design}
          href={`/catalogs/${catalogId}/general/design`}
        />
        <Card
          icon={<PersonIcon fontSize='3rem' />}
          title={localization.catalogAdmin.usernameList}
          body={localization.catalogAdmin.manage.usernameList}
          href={`/catalogs/${catalogId}/general/users`}
        />
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

export default ConceptsPage;
