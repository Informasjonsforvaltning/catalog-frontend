import { withProtectedPage } from "../../../../../utils/auth";
import UsersPageClient from "./users-page-client";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general/users`,
  async ({ catalogId }) => {
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
          {
            href: `/catalogs/${catalogId}/general/users`,
            text: getTranslateText(localization.catalogAdmin.username),
          },
        ] as BreadcrumbType[])
      : [];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.manageCatalog}
          catalogId={catalogId}
        />
        <UsersPageClient catalogId={catalogId} />
      </>
    );
  },
);
