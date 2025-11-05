import {
  BreadcrumbType,
  Breadcrumbs,
  CenterContainer,
  PageBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Heading } from "@digdir/designsystemet-react";

const NoAccess = async ({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) => {
  const { catalogId } = await params;

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: localization.catalogType.concept,
        },
        {
          href: `#`,
          text: localization.noAccess,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.noAccess}
      />
      <CenterContainer>
        <Heading level={2} size="small">
          {localization.youHaveNoAccess}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NoAccess;
