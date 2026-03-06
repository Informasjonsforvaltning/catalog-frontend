import {
  BreadcrumbType,
  Breadcrumbs,
  CenterContainer,
  PageBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Heading } from "@digdir/designsystemet-react";

const NotFound = async () => {
  const breadcrumbList = [
    {
      href: "#",
      text: localization.notFound,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI ?? ""}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.notFound}
      />
      <CenterContainer>
        <Heading level={2} size="small">
          {localization.notFoundPage}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NotFound;
