import { withProtectedPage } from "../../../../../utils/auth";
import UsersPageClient from "./users-page-client";
import { Breadcrumbs, DesignBanner } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general/users`,
  async ({ catalogId }) => {
    const breadcrumbList = catalogId
      ? [
          {
            href: `/catalogs/${catalogId}`,
            text: localization.manageCatalog,
          },
          {
            href: `/catalogs/${catalogId}/general`,
            text: localization.general,
          },
          {
            href: `/catalogs/${catalogId}/general/users`,
            text: localization.catalogAdmin.username,
          },
        ]
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
