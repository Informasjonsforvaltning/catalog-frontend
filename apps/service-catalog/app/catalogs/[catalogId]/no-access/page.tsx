import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/designsystemet-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

const NoAccess = async ({ params }: Params) => {
  const { catalogId } = params;

  const breadcrumbList = catalogId
    ? ([
        {
          href: `#`,
          text: localization.noAccess,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs
        baseURI={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.error}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {localization.youHaveNoAccess}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NoAccess;
