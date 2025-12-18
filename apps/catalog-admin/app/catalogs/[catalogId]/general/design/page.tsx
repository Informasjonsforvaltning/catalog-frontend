import React from "react";
import { withProtectedPage } from "../../../../../utils/auth";
import { getOrganization } from "@catalog-frontend/data-access";
import DesignPageClient from "./design-page-client";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general/design`,
  async ({ catalogId }) => {
    const organization = await getOrganization(catalogId);

    return (
      <DesignPageClient
        organization={organization}
        catalogId={catalogId}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
    );
  },
);
