import React from "react";
import { withProtectedPage } from "../../../../utils/auth";
import GeneralPageClient from "./general-page-client";
import { localization } from "@catalog-frontend/utils";
import { Breadcrumbs, DesignBanner } from "@catalog-frontend/ui";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general`,
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
        <GeneralPageClient catalogId={catalogId} />
      </>
    );
  },
);
