import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Link } from '@digdir/designsystemet-react';

const NoAccess = async ({ params }) => {
  const { catalogId } = params;

  const breadcrumbList = catalogId
    ? ([
        {
          href: `#`,
          text: localization.noAccess,
        },
      ] as BreadcrumbType[])
    : [];

  const link = `${process.env.FDK_BASE_URI}/docs/sharing-data/login-and-access`;

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogOverview}
        subtitle={localization.noAccess}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          <div>{localization.youHaveNoAccessToCatalogs} &nbsp; </div>
          <Link href={link}> {localization.catalogAccessDocumentationLink}</Link>
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NoAccess;
