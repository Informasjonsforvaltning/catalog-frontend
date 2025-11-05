import { withProtectedPage } from "../../../../utils/auth";
import ConceptsPageClient from "./concepts-page-client";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts`,
  async ({ catalogId, session }) => {
    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.manageCatalog,
          },
          {
            href: `/catalogs/${catalogId}/concepts`,
            text: localization.catalogType.concept,
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
          title={localization.catalogAdmin.manage.conceptCatalog}
          catalogId={catalogId}
        />
        <ConceptsPageClient catalogId={catalogId} />
      </>
    );
  },
);
